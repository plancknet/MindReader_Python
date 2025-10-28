import { motion } from "framer-motion";

interface MindRevealProps {
  word: string;
  onRestart: () => void;
}

export function MindReveal({ word, onRestart }: MindRevealProps) {
  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center gap-12 overflow-hidden text-center">
      <motion.div
        className="absolute inset-0 -z-10 opacity-60"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.7 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="h-full w-full bg-[radial-gradient(circle,_rgba(56,189,248,0.18),_transparent_60%)]" />
      </motion.div>

      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          Sua mente foi lida
        </p>
        <motion.h2
          className="text-5xl font-semibold text-white md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Eu li a palavra em que você pensou.
        </motion.h2>

        <motion.div
          className="mx-auto flex max-w-md flex-col items-center gap-6"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 140 }}
        >
          <motion.span
            className="rounded-full border border-white/15 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.35em] text-slate-200"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            A palavra revelada é
          </motion.span>
          <motion.div
            className="relative rounded-[2rem] border border-quadrant.b/50 bg-quadrant.b/20 px-12 py-8 text-4xl font-bold text-white shadow-[0_0_45px_rgba(56,189,248,0.35)] md:text-5xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 12px rgba(56,189,248,0.6)",
                  "0 0 28px rgba(56,189,248,0.85)",
                  "0 0 12px rgba(56,189,248,0.6)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.8 }}
            >
              {word}
            </motion.span>
          </motion.div>
          <motion.p
            className="text-lg text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Sua mente foi lida com sucesso! 🧠✨
          </motion.p>
        </motion.div>
      </div>

  <motion.button
        type="button"
        onClick={onRestart}
        className="rounded-full border border-white/15 bg-transparent px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-200 transition hover:border-quadrant.a/80 hover:text-quadrant.a focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quadrant.a"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Fazer nova leitura
      </motion.button>
    </div>
  );
}
