import RoadmapExperience from "./RoadmapExperience";
import useAlgoNestRoadmapController from "./useAlgoNestRoadmapController";

export default function AlgoNestRoadmap() {
  const roadmap = useAlgoNestRoadmapController();

  return <RoadmapExperience {...roadmap} />;
}
