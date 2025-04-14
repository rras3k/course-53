"use client";

import Image from "next/image";
import imgHome from "@/public/icons/icon-48x48.png";
import { twMerge } from "tailwind-merge";
import { clsx } from 'clsx';

export default function HomeLogo() {

	const iconHome_className = clsx(
		'mx-3 flex-none',
		{
			'bg-yellow-200': false,
		}
	);
	return (
		<div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
			<Image className={twMerge(iconHome_className)} src={imgHome} alt="Home" />

		</div>
	)
	
}
