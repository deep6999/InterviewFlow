import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import { Group, Panel, Separator } from "react-resizable-panels";

{
  /* Components Import */
}
import Navbar from "../components/Navbar";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode.javascript,
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleProblemChange = (newProblemId) =>
    navigate(`/problem/${newProblemId}`);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };
  
  const handleRunCode = () => {};

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1 min-h-0">
        <Group orientation="horizontal" className="h-full">
          {/* left panel-problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <Separator className="w-1.5 shrink-0 bg-base-300 hover:bg-primary data-[separator=active]:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <Group orientation="vertical" className="h-full">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <Separator className="h-1.5 shrink-0 bg-base-300 hover:bg-primary data-[separator=active]:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}
              <Panel defaultSize={30} minSize={30}>
                <OutputPanel />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
}

export default ProblemPage;
