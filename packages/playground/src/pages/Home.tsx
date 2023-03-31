import { useBeforeUnload } from "react-router-dom";

interface Props {

}

function Home (props: Props) {
  useBeforeUnload(() => {
    console.log("useBeforeUnload");
  });

  return <div className="home">
    home here
  </div>
}

export {
  Home
};