import {
	Button,
	Container,
	Html,
	// Img,
	Tailwind,
} from '@react-email/components';
import * as React from 'react';
// import config from '@margins/config/tailwind-preset';

export const VerificationEmail = ({
	code = '123456',
	name = 'there',
	verificationUrl,
}: {
	code: string | number;
	name: string;
	verificationUrl: string;
}) => {
	return (
		<Html className="bg-stone-900">
			<Tailwind>
				<Container className="0 flex h-screen w-full flex-col items-center space-y-8">
					<div className="flex w-full grow items-center justify-center gap-x-2">
						{/* <Img src= */}
						{/* TODO: */}
						{/* <svg
							className="h-6 w-6"
							viewBox="0 0 500 500"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="4"
								y="4"
								width="492"
								height="492"
								rx="246"
								fill="black"
							/>
							<path
								d="M122 134.5C122 120.141 133.641 108.5 148 108.5V108.5C162.359 108.5 174 120.141 174 134.5V391.5H122V134.5Z"
								fill="white"
							/>
							<path
								d="M224 134.5C224 120.141 235.641 108.5 250 108.5V108.5C264.359 108.5 276 120.141 276 134.5V300.01C276 305.135 276 307.698 274.987 309.649C274.133 311.293 272.793 312.633 271.149 313.487C269.198 314.5 266.635 314.5 261.51 314.5H238.49C233.365 314.5 230.802 314.5 228.851 313.487C227.207 312.633 225.867 311.293 225.013 309.649C224 307.698 224 305.135 224 300.01V134.5Z"
								fill="white"
							/>
							<path
								d="M326 134.5C326 120.141 337.641 108.5 352 108.5V108.5C366.359 108.5 378 120.141 378 134.5V391.5H326V134.5Z"
								fill="white"
							/>
						</svg> */}
						<span className="font-sans font-semibold tracking-tighter text-black">
							Margins
						</span>
					</div>
					<div className="max-w-prose font-sans text-black">
						<p className="text-lg font-medium">Hello {name}.</p>
						<p>
							Thanks for joining Margins! Just one more thing — tap on the link
							below to verify your email.
						</p>
					</div>
					<div className="mt-4 flex w-full justify-center">
						<Button
							className="w-full grow rounded bg-black p-3 text-center font-sans text-sm font-medium text-white shadow"
							href={verificationUrl}
						>
							Tap to verify
						</Button>
					</div>
					<div className="my-4 font-sans text-sm text-black">
						Your verification code is <code>{code}</code>.
					</div>
					<div className="my-8 h-px bg-gray-400"></div>
					<p className="font-sans text-xs text-gray-400">
						If you were not expecting this email, you can safelly ignore it.
					</p>
				</Container>
			</Tailwind>
		</Html>
	);
};

export default VerificationEmail;
