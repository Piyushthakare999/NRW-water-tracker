import { useNavigate } from 'react-router-dom';
import { authentication } from '../../utils/firebase-config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// CSS
import './Auth.css';

// Image
import googleSiginButtonImage from '../../images/google-signin-button-normal.png';
import h2oLogo from '../../images/H2O.svg';

const Auth = () => {
	const navigate = useNavigate();

	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(authentication, provider)
			.then((res) => {
				// Navigate to Dashboard
				navigate('/dashboard', { replace: true });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className='auth-wrapper center'>
			<div className='card-wrapper'>
				<div className='card'>
					<header className='center p-4 pt-6'>
						<img src={h2oLogo} alt='logo' />
					</header>
					<div className='card-content pt-2 pb-6 center auth-card-content'>
						<p className='pb-3 pt-5 has-text-grey'>
							Signin to get access to the app
						</p>
						<div className='center' onClick={signInWithGoogle}>
							<img
								className='google-signin-button'
								src={googleSiginButtonImage}
								alt='google-signin-btn'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Auth;
