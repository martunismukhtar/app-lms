class BuatSoal(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        mapel_id = request.data['mapel']
        # int(request.data.get("jumlah", 20))  # Bisa dari input user
        jumlah_soal_total = 5
        mapel = Mapel.objects.filter(id=mapel_id).first()
        org = user.organization
        semester = Semester.objects.filter(
            is_aktif=True, organization=org).first()
        kelas = request.data['kelas']
        
        try:
            vectorstore = load_pgvector_vectorstore()
            retriever = vectorstore.as_retriever(
                search_kwargs={"k": 20, "filter": {"topic": mapel.nama}}  # Increased k for better context
            )

           
            prompt = PromptTemplate(
                input_variables=["context", "jumlah", "tingkat", "generated_topics"],
                template="""
                    Buatkan {jumlah} soal pilihan ganda dengan tingkat kesulitan {tingkat} berdasarkan dokumen berikut. 
                    Generate exactly {jumlah} high-quality multiple-choice questions (MCQs) with {tingkat} difficulty level based on the provided material.

                    ### 📄 Format Soal | Question Format
                    1. Nomor soal (1., 2., 3., ...)  
                    Use numbered questions (1., 2., 3., etc.)
                    2. Pertanyaan diakhiri tanda tanya (?)  
                    The question must end with a question mark (?)
                    3. Pilihan A.–D., satu baris per pilihan  
                    Four choices labeled A. to D., one per line
                    4. Tulis: Jawaban: X (huruf A/B/C/D saja)  
                    Add a line: Answer: X (just a single letter A/B/C/D)
                    5. Beri 1 baris kosong antar soal  
                    Leave 1 blank line between questions
                    6. Tampilkan soal saja, tanpa komentar atau penjelasan tambahan  
                    Show questions only — no commentary, explanation, or intro

                    ### ✅ Kriteria Soal Berkualitas | Quality Criteria
                    - Bahasa jelas 
                    Use clear language
                    - Jangan ambigu atau membingungkan  
                    Avoid ambiguous, tricky, or unclear phrasing
                    - Hanya satu jawaban benar yang logis  
                    Ensure only one correct and reasonable answer
                    - Pilihan lain harus masuk akal, tidak asal  
                    Distractors (wrong answers) must be plausible and non-random
                    - Gunakan variasi kata kerja seperti *jelaskan*, *tentukan*, *identifikasi*  
                    Vary question verbs like *explain*, *identify*, *choose*, *determine*
                    - Soal menguji pemahaman, bukan hafalan  
                    Focus on comprehension and reasoning, not memorization
                    - Hindari soal dengan konsep, kalimat, atau struktur yang mirip  
                    Avoid duplicate ideas, wording, or structure among questions

                    ### 🎯 Tingkat Kesulitan | Difficulty Level
                    {tingkat}:
                    - Mudah: Konsep dasar, definisi, fakta langsung dari materi
                    - Sedang: Aplikasi konsep, analisis sederhana, hubungan antar konsep
                    - Sulit: Analisis mendalam, evaluasi, sintesis, pemecahan masalah kompleks

                    ### 🚫 Hindari Duplikasi | Avoid Duplication
                    PENTING: Jangan buat soal yang mirip dengan yang sudah ada di database:
                    Topik yang sudah ada: {generated_topics}
                    
                    Gunakan variasi:
                    - Sudut pandang berbeda dari topik yang sama
                    - Aspek yang berbeda dari konsep yang sama
                    - Pendekatan yang berbeda untuk materi yang sama
                    - Fokus pada sub-topik yang belum dibahas
                    - Gunakan konteks aplikasi yang berbeda

                    ### 📚 Materi Referensi | Reference Material
                    {context}

                    ⚠️ Pastikan jumlah soal tepat {jumlah}, tidak kurang atau lebih.  
                    ⚠️ Ensure the number of questions is exactly {jumlah}, no more, no less.

                    ⚠️ Tidak perlu menulis pembuka, penutup, atau instruksi tambahan.  
                    ⚠️ Do not include any intro, closing, or extra comments.
                    
                    ⚠️ PASTIKAN JAWABAN BENAR berdasarkan konteks yang diberikan.
                    ⚠️ ENSURE THE ANSWER IS CORRECT based on the given context.
                    """
            )

            combine_docs_chain = create_stuff_documents_chain(
                llm=OpenAI(model="gpt-3.5-turbo-instruct",
                           temperature=0.7, max_tokens=2000),  # Increase temperature for more variety
                prompt=prompt
            )
            rag_chain = create_retrieval_chain(
                retriever=retriever,
                combine_docs_chain=combine_docs_chain
            )

            soal_objects = []
            tingkat_batch = [("mudah", 2), ("sedang", 2), ("sulit", 1)]  # Adjusted distribution
            nomor_global = 1
            total_dibuat = 0
            gagal_batch = []
            
            # Track generated questions to avoid duplicates
            generated_questions = set()
            generated_topics = set()
            
            # Get existing questions from database to avoid duplicates
            existing_soals = Soal.objects.filter(
                mapel_id=mapel_id,
                organization_id=org.id,
                kelas_id=kelas
            ).values_list('pertanyaan', flat=True)
            
            # Add existing questions to tracking sets
            for existing_question in existing_soals:
                generated_questions.add(existing_question.lower().strip())
                generated_topics.add(self.extract_topic(existing_question))
            
            print(f"Found {len(existing_soals)} existing questions in database")

            for tingkat, jumlah in tingkat_batch:
                if total_dibuat >= jumlah_soal_total:
                    break
                target = min(jumlah, jumlah_soal_total - total_dibuat)
                
                # Retry mechanism for better quality
                max_retries = 5  # Increase retries for better variety
                for attempt in range(max_retries):
                    try:
                        # Add randomness to the prompt for variety
                        import random
                        perspective_variations = [
                            f"Fokus pada aspek praktis dari {mapel.nama}",
                            f"Buat soal yang mengukur pemahaman konsep {mapel.nama}",
                            f"Ciptakan soal yang menguji aplikasi {mapel.nama}",
                            f"Buat soal yang menganalisis {mapel.nama}",
                            f"Fokus pada hubungan antar konsep dalam {mapel.nama}"
                        ]
                        
                        selected_perspective = random.choice(perspective_variations)
                        
                        result = rag_chain.invoke({
                            "input": f"{selected_perspective} dengan tingkat kesulitan {tingkat}. Hindari duplikasi dengan soal yang sudah ada.",
                            "jumlah": target,
                            "tingkat": tingkat,
                            "generated_topics": list(generated_topics) if generated_topics else "Belum ada soal yang dibuat"
                        })
                        
                        print(f"AI Response for {tingkat}: {result}")
                        parsed = parse_soal(result["answer"])
                        
                        # Validate parsed questions
                        valid_soals = []
                        for soal in parsed:
                            if self.validate_soal(soal) and not self.is_duplicate(soal, generated_questions):
                                valid_soals.append(soal)
                                # Track question and topic
                                generated_questions.add(soal['pertanyaan'].lower().strip())
                                generated_topics.add(self.extract_topic(soal['pertanyaan']))
                        
                        if len(valid_soals) >= target:
                            for i, soal in enumerate(valid_soals[:target]):
                                # Add timestamp to ensure uniqueness
                                soal_objects.append(Soal(
                                    organization_id=org.id,
                                    semester_id=semester.id,
                                    mapel_id=mapel_id,
                                    tipe_soal='pilihan_ganda',
                                    pertanyaan=soal['pertanyaan'],
                                    pilihan=soal['pilihan'],
                                    jawaban_benar=soal['jawaban'],
                                    tingkat_kesulitan=tingkat,
                                    created_by_id=user.id,
                                    kelas_id=kelas,
                                    created_at=timezone.now()
                                ))
                                nomor_global += 1
                            
                            total_dibuat += len(valid_soals[:target])
                            break  # Success, exit retry loop
                        else:
                            print(f"Attempt {attempt + 1}: Only {len(valid_soals)} valid questions generated, need {target}")
                            if attempt == max_retries - 1:
                                # If we still have some valid questions, use them
                                if valid_soals:
                                    for soal in valid_soals:
                                        soal_objects.append(Soal(
                                            organization_id=org.id,
                                            semester_id=semester.id,
                                            mapel_id=mapel_id,
                                            tipe_soal='pilihan_ganda',
                                            pertanyaan=soal['pertanyaan'],
                                            pilihan=soal['pilihan'],
                                            jawaban_benar=soal['jawaban'],
                                            tingkat_kesulitan=tingkat,
                                            created_by_id=user.id,
                                            kelas_id=kelas,
                                            created_at=timezone.now()
                                        ))
                                    total_dibuat += len(valid_soals)
                                    break
                                else:
                                    raise Exception(f"Tidak bisa membuat soal {tingkat} yang valid dan unik setelah {max_retries} percobaan")
                    
                    except Exception as e:
                        if attempt == max_retries - 1:
                            gagal_batch.append({
                                "tingkat": tingkat,
                                "jumlah_diminta": target,
                                "error": str(e)
                            })
                        else:
                            print(f"Attempt {attempt + 1} failed for {tingkat}: {str(e)}")
                            continue

            if soal_objects:
                Soal.objects.bulk_create(soal_objects)

            return Response({
                "status": "success",
                "message": "Soal berhasil dibuat",
                "soal": SoalSerializer(soal_objects, many=True).data if soal_objects else [],
                "jumlah_soal_disimpan": len(soal_objects),
                "gagal_batch": gagal_batch,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def is_duplicate(self, soal, generated_questions):
        """Check if question is duplicate or too similar"""
        import difflib
        
        current_question = soal['pertanyaan'].lower().strip()
        
        # Check exact match
        if current_question in generated_questions:
            return True
        
        # Check similarity (70% similar = duplicate, lowered threshold)
        for existing_question in generated_questions:
            similarity = difflib.SequenceMatcher(None, current_question, existing_question).ratio()
            if similarity > 0.7:  # Lowered from 0.8 to 0.7
                print(f"Similar question found: {similarity:.2f} similarity")
                return True
        
        return False
    
    def extract_topic(self, question):
        """Extract main topic from question for tracking"""
        import re
        
        # Simple topic extraction - get key nouns/concepts
        # Remove question words and get meaningful words
        stop_words = {'apa', 'siapa', 'kapan', 'dimana', 'mengapa', 'bagaimana', 'yang', 'adalah', 'dari', 'pada', 'dalam', 'untuk', 'dengan', 'oleh', 'tentang'}
        
        words = re.findall(r'\b\w+\b', question.lower())
        meaningful_words = [w for w in words if w not in stop_words and len(w) > 3]
        
        # Return first few meaningful words as topic
        return ' '.join(meaningful_words[:3]) if meaningful_words else 'general'

    def validate_soal(self, soal):
        """Validate generated question structure and content"""
        try:
            # Check if all required fields exist
            if not all(key in soal for key in ['pertanyaan', 'pilihan', 'jawaban']):
                return False
            
            # Check if question ends with ?
            if not soal['pertanyaan'].strip().endswith('?'):
                return False
            
            # Check if answer is valid (A, B, C, or D)
            if soal['jawaban'] not in ['A', 'B', 'C', 'D']:
                return False
            
            # Check if pilihan has exactly 4 choices
            if not isinstance(soal['pilihan'], dict) or len(soal['pilihan']) != 4:
                return False
            
            # Check if all choices A, B, C, D exist
            required_choices = ['A', 'B', 'C', 'D']
            if not all(choice in soal['pilihan'] for choice in required_choices):
                return False
            
            # Check if all choices have content
            if not all(soal['pilihan'][choice].strip() for choice in required_choices):
                return False
            
            return True
        
        except Exception as e:
            print(f"Validation error: {str(e)}")
            return False