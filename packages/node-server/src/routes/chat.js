import { Configuration, OpenAIApi } from "openai";
import config from "../config.js";

const configuration = new Configuration({
  organization: config.organization,
  apiKey: config.key,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!config.key) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": "你好，你是谁"}]
    },
    {
      proxy: config.proxy
    }
  ).then(completion => {
    console.log("completion choices", completion.data.choices);
    res.status(200).json({
      msg: 'ok',
      content: completion.data.choices
    });
  }).catch(error => {
    console.log("error>>>>>", error);
    res.status(500).json(error);
  });
}