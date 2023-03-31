import { animated, useSpring } from "@react-spring/web";

interface Props {

}

function Base (props: Props) {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }))

  const handleClick = () => {
    api.start({
      to: {
        x: 100,
      },
    })
  }

  return <div className="base">
    <button onClick={handleClick}>click</button>
    <animated.div
      className="box"
      style={{
        ...springs
      }}
    />
  </div>
}

export {Base};