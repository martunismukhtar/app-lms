import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/LayoutContext";
import PrivateLayout from "../../../layouts/private/Index";
import AutoQuestionTab from "./AutoQuestionTab";
import UploadQuestionTab from "./UploadQuestionTab";
import ManualQuestionTab from "./ManualQuestionTab";
import QuestionList from "./QuestionList";
import Tabs from "./Tabs";
import HeaderSoal from "./Header";
import { useParams } from "react-router-dom";

const TambahSoal = () => {
  const { id } = useParams();
  const { setActiveMenu } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("auto");
  const { dataSoal } = useContext(UserContext);
  const [manualQuestion, setManualQuestion] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualQuestion.trim() || !manualAnswer.trim()) return;

    setManualQuestion("");
    setManualAnswer("");
  };

  useEffect(() => {
    document.title = "Buat Soal";
    setActiveMenu("buat-ujian");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="p-1 bg-white">
        <HeaderSoal />
        <div className="container mx-auto px-4 py-8">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            {activeTab === "auto" && <AutoQuestionTab ujian_id={id} />}
            {activeTab === "upload" && <UploadQuestionTab ujian_id={id} />}
            {activeTab === "manual" && (
              <ManualQuestionTab
                manualQuestion={manualQuestion}
                manualAnswer={manualAnswer}
                setManualQuestion={setManualQuestion}
                setManualAnswer={setManualAnswer}
                onSubmit={handleManualSubmit}
                ujian_id={id}
              />
            )}
          </div>
          <div>
            <QuestionList questions={dataSoal} />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default TambahSoal;
