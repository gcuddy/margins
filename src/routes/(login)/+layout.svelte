<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="flex animate-fast-fly-in flex-col items-center justify-center space-y-4">
		<div class="flex">
			<div class="max-w-xs px-2">
				<svg
					class="h-20 w-20"
					width="260"
					height="260"
					viewBox="0 0 260 260"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g filter="url(#filter0_d_515_360)">
						<g clip-path="url(#clip0_515_360)">
							<rect
								x="10"
								y="10"
								width="240"
								height="240"
								rx="120"
								fill="url(#paint0_radial_515_360)"
							/>
							<path d="M166.5 13C89 60.5 187 186 166.5 265" stroke="#FFFBEB" stroke-width="9" />
							<path
								d="M193.318 13C115.818 60.5 213.819 186 193.318 265"
								stroke="#FFFBEB"
								stroke-width="9"
							/>
							<path
								d="M219.318 19C141.818 66.5 239.819 192 219.318 271"
								stroke="#FFFBEB"
								stroke-width="9"
							/>
						</g>
					</g>
					<defs>
						<filter
							id="filter0_d_515_360"
							x="8"
							y="9"
							width="244"
							height="244"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="1" />
							<feGaussianBlur stdDeviation="1" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_515_360" />
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="effect1_dropShadow_515_360"
								result="shape"
							/>
						</filter>
						<radialGradient
							id="paint0_radial_515_360"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(130 130) rotate(90) scale(120)"
						>
							<stop stop-color="#FDE68A" />
							<stop offset="1" stop-color="#FBBF24" />
						</radialGradient>
						<clipPath id="clip0_515_360">
							<rect x="10" y="10" width="240" height="240" rx="120" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</div>
		</div>
		<slot />
	</div>
</div>
