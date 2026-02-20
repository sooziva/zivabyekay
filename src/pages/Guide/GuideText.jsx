import { GuideContent } from "./Guide";
import Transition from "../../components/Transition/Transition";

const GuideText = () => <GuideContent withImages={false} withCoverImage={true} />;

export default Transition(GuideText);
