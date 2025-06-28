import { motion, useAnimate } from "motion/react";
import { GithubIcon, BrainIcon, YoutubeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import summarize from "./summarize";
import transcribe from "./transcribe";

function App() {

  const [input, setInput] = useState("");
  const [scope, animate] = useAnimate();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("English");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const languages = ["English", "Hindi", "Hinglish"];

  function extractVideoId(url) {
    try {
      const parsedUrl = new URL(url);

      // Handle youtu.be links
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1); // remove leading slash
      }

      // Handle youtube.com links like https://www.youtube.com/watch?v=VIDEO_ID
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }

      return null; // not a recognized YouTube URL
    } catch (e) {
      return null; // invalid URL
    }
  }



  const handleSubmit = async (e) => {
    setError("");
    setLoading(true);
    try {
      // console.log(input);
      const videoId = extractVideoId(input);

      const transcription = await transcribe(videoId);
      const lastChunk = transcription.transcript[transcription.transcript.length - 1];
      const lastOffset = parseFloat(lastChunk.offset);
      const lastDuration = parseFloat(lastChunk.duration);

      const totalDuration = (lastOffset + lastDuration) / 60;
      if (totalDuration <= 120) {
        const transcript = transcription.transcript.map((item) => item.text).join(" ");
        console.log("Lang: ", lang);
        const summary = await summarize(transcript, lang);
        summary ? setSummary(summary) : null;
      } else {
        alert("the video duration should not be greater than 2 hours!");
        setInput("");
      }
      // console.log(text);
    } catch (error) {
      console.log("App.js :: handleSubmit :: error: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="min-w-screen px-5 py-5 md:py-0 md:px-10 lg:px-20 text-white flex flex-col items-center justify-center gap-10">
      <motion.nav
        className="w-full py-5 lg:py-0 rounded-2xl flex justify-between items-center"
      >
        <div className="w-[10%]"><img className="w-full object-cover" src="./logo.png" alt="logo" /></div>
        <div className=" rounded-full cursor-pointer overflow-hidden">
          <img className="w-10 h-10 object-cover bg-gray-300 hover:bg-gray-100 transition-all duration-300" src="./github.svg" alt="github-icon" />
        </div>
      </motion.nav>

      <main className="w-full flex flex-col justify-center items-center gap-8">
        <motion.div className="w-full flex flex-col gap-5 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl leading-12 md:leading-16 lg:leading-20 font-semibold text-center text-custom-white font-inter text-balance">FreeSummarize — Instantly Convert <span className="bg-[#FF0033] font-bold py-2 px-4 lg:py-4 lg:px-5 text-gray-50 text-shadow-black  shadow-gray-500 font-mono rounded-4xl ">YouTube</span> Videos into Smart Summaries with AI</h1>
          <p className="text-lg font-sans font-normal text-balance text-neutral-400">Save time and grasp insights faster with AI-powered youtube video summaries—simple, fast, and absolutely free.</p>
        </motion.div>

        <div className="w-full flex flex-col items-center justify-center gap-5">
          <motion.div className="w-full md:w-[80%] flex items-center h-[60px] border border-neutral-400 rounded-xl overflow-hidden">
            <input
              type="text"
              className="w-full bg-gray-800/80 text-neutral-500 outline-none text-lg font-normal font-sans h-full px-2 transition-all duration-300"
              placeholder="Paste link here..."
              onChange={(e) => setInput(e.target.value)}
              value={input ? input : ""}
            />
            <button
              className="w-[150px] md:w-[200px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:bg-gradient-to-l
 flex gap-2 items-center font-semibold justify-center px-2 md:px-5 text-sm md:text-xl border-l border-neutral-400 cursor-pointer text-neutral-200 h-full transition-all duration-300 active:text-lg"
              onClick={handleSubmit}
            > <BrainIcon /><span>Summarize</span></button>
          </motion.div>
          <div className="w-[300px] bg-gray-800/80 rounded-2xl border border-neutral-400 px-5">
            <select
              name="language"
              id="lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full h-[60px] text-neutral-500 font-medium text-md font-sans outline-0"
            >
              {languages.map((lang) => (
                <option key={lang} name="lang">
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      

        <div className="w-full bg-gray-800/80 rounded-2xl overflow-hidden border border-neutral-400 shadow-neutral-600 shadow-md relative">
          <textarea className="py-2 px-2  w-full min-h-[500px] h-auto border-none outline-none" defaultValue={summary ? summary : ""} name="summary" id="summary"></textarea>
            {loading && <div className="absolute inset-0 flex items-center justify-center min-h-[200px]">
          <div className="w-10 h-10 border-4 border-t-transparent border-gray-400 rounded-full animate-spin" />
        </div>}
        </div>
      </main>

      <div className='w-full py-5 flex justify-center items-center text-center'>
        <p className='text-gray-400'>© 2025 FreeSummarize. All rights reserved.</p>
      </div>
    </div>
  )
}

export default App
