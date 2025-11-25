
"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  text: string | string[];
  className?: string;
  cursorClassName?: string;
  speed?: number;
  delay?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  className,
  cursorClassName,
  speed = 50,
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const currentIndexRef = useRef(0);
  const currentLineRef = useRef(0);
  const textLines = Array.isArray(text) ? text : [text];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const typeNextChar = () => {
      const currentLine = textLines[currentLineRef.current];
      
      if (!currentLine) {
        setIsComplete(true);
        return;
      }
      
      if (currentIndexRef.current < currentLine.length) {
        setDisplayText(prev => prev + currentLine[currentIndexRef.current]);
        currentIndexRef.current++;
        timeoutId = setTimeout(typeNextChar, speed);
      } else if (currentLineRef.current < textLines.length - 1) {
        setDisplayText(prev => prev + "\n");
        currentLineRef.current++;
        currentIndexRef.current = 0;
        timeoutId = setTimeout(typeNextChar, speed * 3);
      } else {
        setIsComplete(true);
      }
    };

    timeoutId = setTimeout(typeNextChar, delay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);
  
  // Split the display text by newlines to render multiple lines
  const lines = displayText.split('\n');
  
  return (
    <div className={cn("font-mono", className)}>
      {lines.map((line, idx) => (
        <div key={idx} className="flex">
          <span>{line}</span>
          {idx === lines.length - 1 && (
            <span className={cn("ml-0.5 animate-pulse", cursorClassName)}>_</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TypewriterEffect;
