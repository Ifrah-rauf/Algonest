import RoadmapExperience from "./RoadmapExperience";
import useAlgoNestRoadmapController from "./useAlgoNestRoadmapController";
import "../../styles/roadmap-express.css";

export default function AlgoNestRoadmap() {
  const roadmap = useAlgoNestRoadmapController();

  return <RoadmapExperience {...roadmap} />;
}
