// import { getAppVersion } from '@/lib/rrasb2k/app';
import { getVersion } from '@/lib/artaxi';

export default function Version() {
	return (
		<>
			{getVersion()}
		</>
	)
}
