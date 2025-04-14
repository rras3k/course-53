import * as React from "react"

import { cn } from "@/lib/utils"

const Encart = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex  rounded-xl items-center py-4 my-2 bg-muted/60",
			className
		)}
		{...props}
	/>
))
Encart.displayName = "Encart"

const EncartLabel = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"rounded-xl  w-80  mx-4",
			className
		)}
		{...props}
	/>
))
EncartLabel.displayName = "EncartLabel"


const EncartContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex justify-center",
			className
		)}
		{...props}
	/>
))
EncartContent.displayName = "EncartContent"





export { Encart, EncartLabel, EncartContent }