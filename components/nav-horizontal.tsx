"use client"

import { Filter, Menu, X } from 'lucide-react';
import Image from "next/image";
import imgHome from "@/public/icon-48x48.png";
import { Button } from "./ui/button";
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getFiltreCourseColor, getFiltreCourseFillColor, getTitle } from "@/lib/affinis";

import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
// import Version from "./version";
import MenuApp from './menu-app';
// import { get } from 'idb-keyval'
import { isPathCourseFiltreTaxi, isPathCourseFiltreAllTaxi } from '@/lib/affinis';
import { useHasPropositionContext } from '@/providers/has-proposition-provider';



export function NavHor() {

	const router = useRouter();

	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const { hasProposition } = useHasPropositionContext()

	const [isNavMobileOpen, setIsNavMobileOpen] = useState(false);
	const [isShowDeconnexion, setIsShowDeconnexion] = useState(false);
	const [filtreCourseFillColor, setFiltreCourseFillColor] = useState('');
	const [filtreCourseColor, setFiltreCourseColor] = useState('bg-green-400');
	const [showFiltreTaxi, setShowFiltreTaxi] = useState<boolean>(false)
	const [showFiltreAllTaxi, setShowFiltreAllTaxi] = useState<boolean>(false)
	const [title, setTitle] = useState("");
	// const dejaFait = useRef<boolean>(false)

	// titre de la barre
	const path = usePathname();
	const searchParams = useSearchParams();
	const filtre = searchParams.get('filtre');



	useEffect(() => {
		setShowFiltreTaxi(isPathCourseFiltreTaxi(path))
		setShowFiltreAllTaxi(isPathCourseFiltreAllTaxi(path))
		setTitle(getTitle(path));
	}, [path]);

	useEffect(() => {
		setFiltreCourseFillColor(getFiltreCourseFillColor(filtre));
		setFiltreCourseColor(getFiltreCourseColor(filtre));
	}, [filtre]);

	const iconHome_className = clsx(
		'mx-3 flex-none',
		{
			'bg-yellow-200': hasProposition,
		}
	);

	const menuClick = (bool: boolean) => {
		setOpenMenu(bool)
	}

	// if (!dejaFait.current) {
	// 	dejaFait.current = true
	// 	const channelHasNotification = new BroadcastChannel('sw-hasNotification');
	// 	channelHasNotification.addEventListener('message', event => {
	// 		console.log('Received sw-hasNotification !!!!', event.data);
	// 		setHasProposition(event.data.hasProposition);
	// 	});
	// }

	return (
		<>
				{
					// Menu quand on clique sur le burger bouton
					openMenu && <MenuApp openMenu={openMenu} setOpenMenu={setOpenMenu} pathName={path} setIsShowDeconnexion={setIsShowDeconnexion} />
				}
				<nav className="h-12 fixed w-full bg-sky-700">
					{/* <div className="bg-green-200 bg-red-200 bg-blue-200 bg-grey-200 bg-yellow-200"></div> */}
					{/* Version mobile */}
					{/* <div className="md:hidden flex content-center"> */}

					<div className="flex content-center mx-auto md:w-[768px]">
						<Image className={twMerge(iconHome_className)} src={imgHome} alt="Home" />
						<div className="flex-auto flex items-center justify-center">
							<div className=" text-lg content-center text-center font-bold text-white uppercase">
								{title}
							</div>
						</div>

						{showFiltreTaxi &&
							<div onClick={() => router.push('/taxi/course-filtre')} className={` ${filtreCourseColor}  mx-2 w-10 flex-none  border rounded-md h-10 content-center my-auto  border-0`} >
								<Filter strokeWidth={1} className={` ${filtreCourseFillColor} stroke-sky-700 mx-auto`} size={32} />
							</div>
						}
						{showFiltreAllTaxi &&
							<div onClick={() => router.push('/taxi/course-filtre')} className={` ${filtreCourseColor}  mx-2 w-10 flex-none  border rounded-md h-10 content-center my-auto  border-0`} >
								<Filter strokeWidth={1} className={` ${filtreCourseFillColor} stroke-sky-700 mx-auto`} size={32} />
							</div>
						}
						{isNavMobileOpen && <div onClick={() => setIsNavMobileOpen(false)} className="mx-2 w-10 flex-none border-sky-100 border rounded-md h-10 content-center my-auto border-0" >
							<X strokeWidth={1} className="stroke-white mx-auto" size={36} />
						</div>}

						<div onClick={() => menuClick(true)} className="mx-2 w-10 flex-none border-sky-100 border rounded-md h-10 content-center my-auto border-0" >
							<Menu strokeWidth={1} className="stroke-white mx-auto" size={36} />
						</div>
					</div>

					{/* Deconnexion */}
					{isShowDeconnexion &&
						<div className="mx-auto md:w-[768px] fixed bg-white  h-full top-13 inset-x-0 p-2 transition transform origin-top-right ">
							<span className="text-2xl my-20">
								Voulez vous vous déconnecter de l&aposapplication ?
							</span>
							<div className="flex justify-around text-lg">
								<Button onClick={() => {
									setIsNavMobileOpen(false);
									setIsShowDeconnexion(false);
								}} className="h-14 w-36 text-lg bg-secondary">Non</Button>
								<Button onClick={() => {
									setIsShowDeconnexion(false);
									router.push("/identification")
								}
								} className="h-14 w-36 text-lg bg-primary">Oui</Button>
							</div>
						</div>
					}
				</nav>
		</>
	)
}
