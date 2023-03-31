import './index.scss';
import { Base } from "./base";

interface Props {}

function Animate (props: Props) {

  return <div className="animate">
    <section>
      <h2>
        <a href="//www.react-spring.dev/docs/utilities/use-in-view" target="_blank">Sprint</a>
      </h2>
      <Base />
    </section>
  </div>
}

export default Animate;