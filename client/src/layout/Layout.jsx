import { Footer, Header } from '../components';
import { Outlet } from 'react-router-dom';
import { Toaster, ToastBar } from 'react-hot-toast';

export const Layout = () => {
	return (
		<>
			<Header />
			<Outlet>
			</Outlet>
			<Footer />
			<Toaster>
				{(t) => (
					<ToastBar
						toast={t}
						style={{
							...t.style,
							animation: t.visible
								? 'custom-enter 1s ease'
								: 'custom-exit 1s ease',
						}}
					/>
				)}
			</Toaster>
		</>
	);
};
