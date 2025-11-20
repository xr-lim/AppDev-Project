import logo from '../assets/logo.png';

export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src={logo}
            alt="UTM Report System"
            className={className}
            {...props}
        />
    );
}
