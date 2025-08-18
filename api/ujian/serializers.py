from rest_framework import serializers
from .models import ExamResult, Ujian, ExamAnswer


class UjianSerializer(serializers.ModelSerializer):
    # Read-only fields (untuk tampilkan nama relasi)
    nama_kelas = serializers.CharField(source='kelas.name', read_only=True)
    nama_mapel = serializers.CharField(source='mapel.nama', read_only=True)
    nama_semester = serializers.CharField(
        source='semester.semester', read_only=True)
    score = serializers.SerializerMethodField()

    class Meta:
        model = Ujian
        fields = [
            'id',
            'judul',
            'jenis_ujian',
            'tanggal',
            'waktu_mulai',
            'durasi',
            'bobot_nilai',
            'passing_grade',
            'tanggal_akhir',
            'kelas',        # dikirim ID
            'mapel',        # dikirim ID
            'nama_kelas',   # hanya ditampilkan (read-only)
            'nama_mapel',   # hanya ditampilkan (read-only)
            'organization',
            'nama_semester',
            'score'
        ]
        extra_kwargs = {
            'judul': {
                'error_messages': {
                    'required': 'Judul ujian tidak boleh kosong.',
                    'blank': 'Judul ujian wajib diisi.'
                }
            },
            'jenis_ujian': {
                'error_messages': {
                    'required': 'Jenis ujian wajib dipilih.',
                    'blank': 'Jenis ujian wajib dipilih.'
                }
            },
            'tanggal': {
                'error_messages': {
                    'required': 'Tanggal wajib dipilih.',
                    'blank': 'Tanggal wajib dipilih.'
                }
            },
            'waktu_mulai': {
                'error_messages': {
                    'required': 'Waktu mulai wajib dipilih.',
                    'blank': 'Waktu mulai wajib dipilih.'
                }
            },
            'durasi': {
                'error_messages': {
                    'required': 'Durasi wajib diisi.',
                    'invalid': 'Durasi harus berupa angka.'
                }
            },
            'bobot_nilai': {
                'error_messages': {
                    'required': 'Bobot nilai wajib diisi.',
                    'invalid': 'Bobot nilai harus angka desimal.'
                }
            },
            'passing_grade': {
                'error_messages': {
                    'required': 'Passing grade wajib diisi.',
                    'invalid': 'Passing grade harus angka desimal.'
                }
            },
            'kelas': {
                'error_messages': {
                    'required': 'Kelas wajib dipilih.',
                    'blank': 'Kelas wajib dipilih.'
                }
            },
            'mapel': {
                'error_messages': {
                    'required': 'Mata pelajaran wajib dipilih.',
                    'blank': 'Mata pelajaran wajib dipilih.'
                }
            },
            'tanggal_akhir': {
                'error_messages': {
                    'required': 'Tanggal akhir wajib dipilih.',
                    'blank': 'Tanggal akhir wajib dipilih.'
                }
            }
        }
        
    def get_score(self, obj):
        return getattr(obj, 'score', None)


class ExamResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamResult
        fields = ('id', 'user_id', 'ujian_id',
                  'submitted_at', 'duration', 'score',
                  'attempt', 'waktu_mulai')
        # read_only_fields = ('created_at','id')


class ExamAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamAnswer
        fields = ('id', 'selected_choice', 'result_id', 'soal_id')
