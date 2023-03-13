

export default function (req, res) {
  res.type('html').status(200).json({
    content: 'hello'
  });
}