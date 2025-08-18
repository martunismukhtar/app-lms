import { useContext, useEffect, useState } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { UserContext } from "../../context/LayoutContext";
import HeaderSoal from "./Header";
import Tabs from "./Tabs";
import AutoQuestionTab from "./AutoQuestionTab";
import UploadQuestionTab from "./UploadQuestionTab";
import ManualQuestionTab from "./ManualQuestionTab";
import QuestionList from "./QuestionList";
import FilterElement from "./FilterElement";

const BuatSoal = () => {
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
    setActiveMenu("soal");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="p-1 bg-white">
        <HeaderSoal />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FilterElement />
          </div>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            {activeTab === "auto" && <AutoQuestionTab />}
            {activeTab === "upload" && <UploadQuestionTab />}
            {activeTab === "manual" && (
              <ManualQuestionTab
                manualQuestion={manualQuestion}
                manualAnswer={manualAnswer}
                setManualQuestion={setManualQuestion}
                setManualAnswer={setManualAnswer}
                onSubmit={handleManualSubmit}
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

export default BuatSoal;
