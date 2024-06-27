import { useAsciiText, alligator } from "react-ascii-text";

export default function ASCIIANIMATION() {
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 2000,
    animationDirection: "down",
    animationInterval: 100,
    animationLoop: true,
    animationSpeed: 30,
    font: alligator,
    text: ["MOONER", "TRENDING"],
  });

  return <pre ref={asciiTextRef}></pre>;
}
