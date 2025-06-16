import { Hourglass } from 'react-loader-spinner';

const CustomLoader = () => {
	return (
		<Hourglass
			visible={true}
			height="80"
			width="80"
			ariaLabel="hourglass-loading"
			wrapperStyle={{}}
			wrapperClass=""
			colors={['#306cce', '#72a1ed']}
		/>
	);
};

export const FullScreenLoader = () => {
	return (
		<div
			style={{
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
			}}
		>
			<CustomLoader />
		</div>
	);
};
