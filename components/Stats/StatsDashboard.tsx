"use client";

import { motion } from "framer-motion";

export default function StatsDashboard() {
    const percentage = 0.25; 
    return (
        <div className="px-2 py-1 flex flex-col shadow-nadal bg-white rounded-lg h-full">
            <div className="w-full">Stats</div>
            <div className="flex flex-col flex-1">
                <div className="second-font px-1 leading-none -mt-1">LVL :</div>
                
                <div className="relative flex items-center justify-center -mt-2 h-3/4">
                    
                    
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="absolute">
                        <path d="M40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0ZM39.5 6C20.9985 6 6 20.9985 6 39.5C6 58.0015 20.9985 73 39.5 73C58.0015 73 73 58.0015 73 39.5C73 20.9985 58.0015 6 39.5 6Z" fill="#DDDEF4"/>
                    </svg>

                   
                    <motion.svg 
                        width="80" height="80" viewBox="0 0 80 80" 
                        className="absolute -rotate-90"
                    >
                    <motion.circle
                        cx="40"
                        cy="40"
                        r="37"
                        stroke="#4ADE80"
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="transparent"
                        
                        style={{ pathLength: percentage }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: percentage }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    </motion.svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">9</span>
                    </div>
                </div>
                
                <div className="second-font h-1/4">
                    <div>insignes :</div>
                    <div className="flex gap-2"></div>
                </div>
            </div>
        </div>
    );
}