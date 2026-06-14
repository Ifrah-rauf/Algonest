import { motion } from "framer-motion";
import plane from "../static/AlgoPlane.png";
import logo from "../static/logo.png";

function CloudShape({ className = "" }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute left-[8%] top-[34%] w-[30%] h-[48%] rounded-full bg-white" />
        <div className="absolute left-[24%] top-[16%] w-[34%] h-[62%] rounded-full bg-white" />
        <div className="absolute left-[50%] top-[28%] w-[30%] h-[52%] rounded-full bg-white" />
        <div className="absolute left-[12%] top-[48%] w-[68%] h-[36%] rounded-full bg-white" />
      </div>
    </div>
  );
}

export default function AuthExperienceShell({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <div
      className="h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, #f7f3ff 0%, #ffffff 30%, #f5f0ff 60%, #ede7ff 100%)",
        fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif",
      }}
    >
      <CloudShape className="top-[-70px] right-[-40px] w-[340px] h-[180px] opacity-90" />
      <CloudShape className="bottom-[-60px] left-[-40px] w-[390px] h-[200px] opacity-90" />
      <CloudShape className="top-[18%] left-[34%] w-[180px] h-[90px] opacity-60" />

      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "rgba(124,58,237,0.22)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "rgba(252,211,77,0.22)" }}
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.7, 0.4, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 h-screen flex flex-col lg:flex-row px-4 lg:px-8 py-4 lg:py-6">
        <div className="hidden lg:flex lg:w-[48%] px-4 lg:px-6 pt-4 pb-2 flex-col">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AlgoNest" className="w-8 h-8" />
            <div className="text-xl font-black text-[#6b46c1] tracking-tight">
              Algo<span className="text-yellow-500">Nest</span>
            </div>
          </div>

          <div className="relative flex-1 flex flex-col justify-center max-w-lg py-10">
            <motion.p
              className="text-xs font-bold tracking-[0.35em] uppercase text-[#8b5cf6]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              className="mt-4 text-4xl lg:text-5xl font-black text-[#1e1145] leading-[0.95]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="mt-5 text-sm text-[#6f6690] leading-7 max-w-sm"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>

            <motion.img
              src={plane}
              alt="AlgoNest paper plane"
              className="mt-8 w-[230px] lg:w-[300px] self-center drop-shadow-[0_30px_45px_rgba(107,70,193,0.28)]"
              initial={{ x: -120, y: 60, rotate: -12, opacity: 0 }}
              animate={{
                x: [0, 20, 0],
                y: [0, -24, 0],
                rotate: [2, 8, 2],
                opacity: 1,
              }}
              transition={{
                opacity: { duration: 0.8 },
                x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            <motion.div
              className="absolute left-[8%] bottom-[10%] w-20 h-20 rounded-full bg-white/75 border border-white shadow-[0_20px_40px_rgba(124,58,237,0.15)]"
              animate={{ y: [0, 18, 0], x: [0, 14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[10%] bottom-[18%] w-14 h-14 rounded-full bg-yellow-200/70 blur-[1px]"
              animate={{ y: [0, -16, 0], x: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="
        flex
        justify-center
          w-full
          lg:w-[52%]
          lg:mt-20
          h-screen
          overflow-hidden
          flex
          items-center
          justify-center
          p-4
        ">
          <motion.div
            className="
              
              w-full
              max-w-[760px]
              h-full
              overflow-hidden
              p-4
              lg:p-7
            "
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
