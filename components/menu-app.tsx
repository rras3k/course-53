import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { CircleX } from 'lucide-react';



import Version from "./version"
import { useRouter } from 'next/navigation';


export default function MenuApp({ openMenu, setOpenMenu, setIsShowDeconnexion, pathName }) {
	const router = useRouter();
	console.log("pathName", pathName);

	const goAndClose = (url: string) => {
		setOpenMenu(false);
		router.push(url);
	}
	return (
		<>
			<AlertDialog open={openMenu} onOpenChange={setOpenMenu}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<CircleX onClick={() => { setOpenMenu(false) }} size={42} />
						</AlertDialogTitle>
						{/* <AlertDialogDescription> */}
							<div className="flex flex-col h-full">
								{(pathName != "/taxi/courses") && <div onClick={() => goAndClose('/taxi/courses')} className={"h-20 my-2 flex place-items-center justify-start text-center  mx-5   border rounded-xl bg-blue-300 hover:bg-blue-400    text-2xl text-sky-950 "}>
									<div className="flex-auto">
										Courses
									</div>
								</div>}
								{(pathName != "/taxi/messages") && <div onClick={() => goAndClose('/taxi/messages')} className={"h-20 my-2 flex place-items-center justify-start text-center  mx-5  h-30 border rounded-xl bg-blue-300 hover:bg-blue-400    text-2xl text-sky-950 "}>
									<div className="flex-auto">
										Messages
									</div>
								</div>}
								{(pathName != "/taxi/aide") && <div onClick={() => goAndClose('/aide')} className={"h-20 my-2 flex place-items-center justify-start text-center  mx-5  h-30 border rounded-xl bg-blue-300 hover:bg-blue-400   text-2xl text-sky-950 "}>
									<div className="flex-auto">
										Aide
									</div>
								</div>}
								{(pathName != "/parametrage") && <div onClick={() => goAndClose('/parametrage')} className={"h-20 my-2 flex place-items-center justify-start text-center  mx-5  h-30 border rounded-xl bg-blue-300 hover:bg-blue-400   text-2xl text-sky-950 "}>
									<div className="flex-auto">
										Parametrage
									</div>
								</div>}

								{<div onClick={() => {
									setOpenMenu(false);
									setIsShowDeconnexion(true)
								}} className={"h-20 my-2 flex place-items-center justify-start text-center  mx-5  h-30 border rounded-xl bg-blue-300 hover:bg-blue-400   text-2xl text-sky-950 "}>
									<div className="flex-auto">
										Deconnexion
									</div>
								</div>}

							</div>
						{/* </AlertDialogDescription> */}
					</AlertDialogHeader>

					<AlertDialogFooter>
						Version <Version />
					</AlertDialogFooter>

				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

// <AlertDialog>

// 	<AlertDialogContent>
// 		<AlertDialogHeader>
// 			<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
// 			<AlertDialogDescription>
// 				This action cannot be undone. This will permanently delete your
// 				account and remove your data from our servers.
// 			</AlertDialogDescription>
// 		</AlertDialogHeader>
// 		<AlertDialogFooter>
// 			<AlertDialogCancel>Cancel</AlertDialogCancel>
// 			<AlertDialogAction>Continue</AlertDialogAction>
// 		</AlertDialogFooter>
// 	</AlertDialogContent>
// </AlertDialog>