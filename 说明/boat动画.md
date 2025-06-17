html
<svg width="80vmin" height="80vmin" viewBox="-110 -110 220 220" fill="none">
	<desc>
		A styleized paper boat bobbing up an down. With three animated squiggly lines below giving the imgpression of flowing water.
	</desc>
	<clipPath id="boatClipPath">
		<path d="m-100 8 q 20 10 40 0 t 40 0 40 0 40  0 40 0 40 0 40 0 v -100 h -280" />
	</clipPath>
	<g id="boat-clip" clip-path="url(#boatClipPath)">
		<g id="boat">
			<path d="m-80 -20 h 160 l -40 60 h -80" fill="currentColor" />
			<path d="m-30 -25 l 30 -30 30 30" fill="currentColor" />
			<animateTransform type="translate" attributeName="transform" keyTimes="0;0.5;1" values="0 0; 0 8; 0 0" keySplines=".5,.0,.5,1; .5,.0,.5,1" dur="2s" repeatCount="indefinite" calcMode="spline" additive="sum" />
			<animateTransform type="rotate" attributeName="transform" keyTimes="0;0.5;1" values="-4;4; -4" keySplines=".5,.0,.5,1; .5,.0,.5,1" dur="6s" repeatCount="indefinite" calcMode="spline" additive="sum" />

		</g>
	</g>
	<path d="m-100 20 q 20 10 40 0 t 40 0 40 0 40  0 40 0" stroke="currentColor" stroke-width="5" stroke-dasharray="20 15 0 15" stroke-linecap="round">
		<animate attributeName="stroke-dashoffset" to="50" dur="1s" repeatCount="indefinite" />
	</path>
	<path d="m-100 40 q 20 10 40 0 t 40 0 40 0 40  0 40 0" stroke="currentColor" stroke-width="5" stroke-dasharray="20 15 0 15" stroke-linecap="round" stroke-dashoffset="25">
		<animate attributeName="stroke-dashoffset" to="-25" dur="1s" repeatCount="indefinite" />
	</path>
	<path d="m-100 60 q 20 10 40 0 t 40 0 40 0 40  0 40 0" stroke="currentColor" stroke-width="5" stroke-dasharray="20 15 0 15" stroke-linecap="round">
		<animate attributeName="stroke-dashoffset" to="50" dur="1s" repeatCount="indefinite" />
	</path>
</svg>

css
body {
	background-color: navy;
	color: white;
	display: grid;
	place-items: center;
	min-height: 100vh;
	min-height: 100dvh;
}