import { Info } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    description: string;
     className?: string;
};

const RevenueDescriptionTooltip = ({ description, className }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`transition ${className}`}
            aria-label="Revenue calculation info"
          >
            <Info className="h-5 w-5" />
          </button>
        </TooltipTrigger>

        <TooltipContent
          side="right"
          align="start"
          sideOffset={8}
          className="max-w-sm max-h-96 bg-white text-black shadow-2xl overflow-y-auto text-sm leading-relaxed"
        >
          <p className="whitespace-pre-line">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


export default RevenueDescriptionTooltip;
