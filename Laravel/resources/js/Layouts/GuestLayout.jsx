import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <>
            <style>{`
                .auth-background {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }

                .auth-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    width: 100%;
                    max-width: 440px;
                    animation: slideUp 0.5s ease-out;
                }

                .logo-container {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .logo-container img {
                    height: 100px;
                    width: auto;
                    margin: 0 auto 16px;
                    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
                    transition: transform 0.3s ease;
                }

                .logo-container img:hover {
                    transform: scale(1.05);
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 640px) {
                    .auth-card {
                        padding: 32px 24px;
                    }

                    .logo-container img {
                        height: 80px;
                    }
                }
            `}</style>

            <div className="auth-background">
                <div className="auth-card">
                    <div className="logo-container">
                        <Link href="/">
                            <img src="/logo.png" alt="UTM Logo" />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}
