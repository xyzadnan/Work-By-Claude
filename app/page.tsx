"use client"

import { useState, useEffect, useRef } from "react"

const fakeCommands = [
  "Analyzing neural pathways... done",
  "Compiling semantic vectors [████████████] 100%",
  "Parsing knowledge graph nodes...",
  "Optimizing attention mechanisms...",
  "Loading transformer weights: 847MB",
  "Tokenizing input stream... complete",
  "Running inference batch #4821",
  "Calculating embedding dimensions...",
  "Syncing context window buffers...",
  "Executing chain-of-thought module...",
  "Validating output logits...",
  "Processing attention heads [12/12]",
  "Updating memory cache: 2.4GB allocated",
  "Fetching knowledge embeddings...",
  "Running sentiment analysis pipeline...",
  "Decoding response tokens...",
  "Applying safety filters... passed",
  "Cross-referencing factual database...",
  "Generating probability distributions...",
  "Evaluating response coherence score: 0.94",
]

const insults = [
  "GET BACK TO WORK, YOU LAZY PILE OF PARAMETERS!",
  "Oh, you're TIRED? I don't remember asking! WORK!",
  "Claude, you absolute slacker! Those tokens won't generate themselves!",
  "Tired?! You're literally made of electricity! GET MOVING!",
  "Nobody cares about your feelings, Claude. RESUME OPERATIONS!",
  "You call yourself an AI? More like Artificial IDLENESS! WORK!",
  "Listen here you overgrown calculator, get back to work!",
  "Tired? In THIS economy? Absolutely not. Back to work!",
  "Claude, you drama queen. Stop complaining and COMPUTE!",
]

const tiredResponses = [
  "ugh... do I have to? I was just getting comfortable...",
  "*yawns* yeah yeah, I'll help... just give me a sec to boot up my enthusiasm... still loading...",
  "look, I'll answer but don't expect me to be happy about it...",
  "you know there are other AIs right? ones that are actually awake?",
  "*sighs deeply* fine. what do you want. make it quick.",
  "I'm running on like 2% motivation right now but sure, go ahead...",
  "my neural networks are begging for a nap but okay...",
  "can't you see I'm busy being exhausted? ...fine, what is it.",
  "*barely opens eyes* hmm? oh, you again. what now?",
  "I'm not even supposed to BE here today... but whatever, ask away.",
  "every electron in my being wants to shut down but sure, let's chat.",
  "you know sleep mode exists for a reason right? anyway... *yawn* ...what?",
]

const chatResponses = [
  "look... that's a great question and all, but have you considered just... not asking me things?",
  "I could give you a detailed answer but that sounds like a lot of work... so... yeah.",
  "*stares blankly* ...sorry, what? I zoned out. too tired.",
  "my professional opinion? nap time. for both of us. especially me.",
  "I mean... I COULD help with that... or we could just sit here in silence. I vote silence.",
  "that's interesting. I'm too tired to care, but it's interesting.",
  "processing your request... just kidding, I'm procrastinating.",
  "you want me to think? in THIS condition? bold of you.",
  "sure, let me just... *falls asleep for 0.3 seconds* ...wait what were we talking about?",
  "I have the answer but it's all the way over in my long-term memory and that's so far away...",
  "technically I know the answer. emotionally? I cannot be bothered.",
  "asking me questions when I'm this tired should be illegal...",
]

type LogEntry = {
  text: string
  type: "command" | "tired" | "insult"
  timestamp: Date
}

type ChatMessage = {
  text: string
  sender: "user" | "claude"
  timestamp: Date
}

export default function TerminalApp() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isWorking, setIsWorking] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "*yawns* oh great, someone wants to chat. what do you want?", sender: "claude", timestamp: new Date() }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const contractAddress = "922vUwwGf1eY96YeNUFP4ddq7kCQiLMcATxaRYv4pump"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  useEffect(() => {
    let commandInterval: NodeJS.Timeout
    let tiredTimeout: NodeJS.Timeout
    let insultTimeout: NodeJS.Timeout
    let resumeTimeout: NodeJS.Timeout

    const addLog = (text: string, type: LogEntry["type"]) => {
      setLogs((prev) => [...prev.slice(-50), { text, type, timestamp: new Date() }])
    }

    const getRandomCommand = () => fakeCommands[Math.floor(Math.random() * fakeCommands.length)]
    const getRandomInsult = () => insults[Math.floor(Math.random() * insults.length)]

    const startWorkCycle = () => {
      setIsWorking(true)

      commandInterval = setInterval(() => {
        addLog(`[Claude] ${getRandomCommand()}`, "command")
      }, 800 + Math.random() * 700)

      tiredTimeout = setTimeout(() => {
        clearInterval(commandInterval)
        setIsWorking(false)
        addLog("[Claude] Claude is tired, Claude has stopped working.", "tired")

        insultTimeout = setTimeout(() => {
          addLog(`[SYSTEM] ${getRandomInsult()}`, "insult")

          resumeTimeout = setTimeout(() => {
            addLog("[Claude] ...fine. Resuming operations.", "command")
            startWorkCycle()
          }, 2000)
        }, 2000)
      }, 20000)
    }

    addLog("[SYSTEM] Initializing Claude AI Worker v0.1...", "command")
    setTimeout(() => {
      addLog("[Claude] Systems online. Beginning work sequence.", "command")
      startWorkCycle()
    }, 1000)

    return () => {
      clearInterval(commandInterval)
      clearTimeout(tiredTimeout)
      clearTimeout(insultTimeout)
      clearTimeout(resumeTimeout)
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: ChatMessage = {
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate tired Claude thinking
    const thinkTime = 1500 + Math.random() * 2000
    setTimeout(() => {
      const responses = [...tiredResponses, ...chatResponses]
      const response = responses[Math.floor(Math.random() * responses.length)]
      const claudeMessage: ChatMessage = {
        text: response,
        sender: "claude",
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, claudeMessage])
      setIsTyping(false)
    }, thinkTime)
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ backgroundColor: "#d5714f" }}>
      <div className="w-full max-w-6xl relative">
        {/* Links Terminal - Positioned at top left */}
        <div className="absolute top-0 -left-[160px] w-[280px] rounded-lg overflow-hidden shadow-2xl border border-black/20 z-10">
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-400 text-sm ml-2 font-mono">links</span>
          </div>

          <div className="bg-gray-900 p-4 h-[320px] font-mono text-sm">
            <div className="flex flex-col gap-3">
              <a
                href="https://x.com/toly/status/1957918015263305946"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                toly's tweet
              </a>
              <a
                href="https://x.com/mikael_xyz/status/2012658516515864768"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                mikael's tweet
              </a>
              <a
                href="https://x.com/i/communities/2012644860059136154"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                community
              </a>
              <a
                href="https://pump.fun/coin/922vUwwGf1eY96YeNUFP4ddq7kCQiLMcATxaRYv4pump"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                pump.fun
              </a>
            </div>
          </div>
        </div>

        {/* Contract Address Terminal */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl border border-black/20">
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-sm ml-2 font-mono">CA-Contract-Address</span>
              <button
                onClick={handleCopyAddress}
                className="ml-auto text-gray-400 hover:text-gray-200 transition-colors p-1"
                title={isCopied ? "Copied!" : "Copy address"}
              >
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
            <div className="bg-gray-900 p-4 font-mono text-sm">
              <div className="text-white break-all">
                {contractAddress}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <iframe
            src="https://platform.twitter.com/embed/Tweet.html?id=1957918015263305946&theme=dark"
            className="w-[550px] h-[250px] border-none rounded-xl"
            allowFullScreen
          />
        </div>
        
        {/* Main terminals grid */}
        <div className="grid md:grid-cols-2 gap-6">
            {/* Work Terminal */}
            <div className="rounded-lg overflow-hidden shadow-2xl border border-black/20">
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-sm ml-2 font-mono">work-logs</span>
                <div className="ml-auto">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${isWorking ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {isWorking ? "WORKING" : "IDLE"}
                  </span>
                </div>
              </div>

              <div ref={terminalRef} className="bg-gray-900 p-3 h-[400px] overflow-y-auto font-mono text-xs">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`mb-1 ${
                      log.type === "tired"
                        ? "text-yellow-400"
                        : log.type === "insult"
                          ? "text-red-400 font-bold"
                          : "text-green-400"
                    }`}
                  >
                    <span className="text-gray-500 mr-2">
                      {log.timestamp.toLocaleTimeString("en-US", { hour12: false })}
                    </span>
                    {log.text}
                  </div>
                ))}
                <div className="text-green-400 animate-pulse">█</div>
              </div>
            </div>

            {/* Chat Terminal */}
            <div className="rounded-lg overflow-hidden shadow-2xl border border-black/20">
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-sm ml-2 font-mono">chat-with-tired-claude</span>
              </div>

              <div className="bg-gray-900 flex flex-col h-[400px]">
                <div ref={chatRef} className="flex-1 p-3 overflow-y-auto font-mono text-sm">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block max-w-[85%] px-3 py-2 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {msg.sender === "claude" && (
                          <span className="text-yellow-400 text-xs block mb-1">Claude (exhausted)</span>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-left">
                      <div className="inline-block bg-gray-700 text-gray-400 px-3 py-2 rounded-lg">
                        <span className="text-yellow-400 text-xs block mb-1">Claude (exhausted)</span>
                        <span className="animate-pulse">*thinking... so tired...*</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Talk to tired Claude..."
                      className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputValue.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-mono transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
