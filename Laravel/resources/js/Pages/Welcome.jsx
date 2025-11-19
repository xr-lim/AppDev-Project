import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome - UTM Report System" />

            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .welcome-container {
                    text-align: center;
                    color: white;
                    padding: 40px;
                }

                .logo-container {
                    margin-bottom: 40px;
                    animation: fadeInDown 1s ease-out;
                }

                .logo {
                    width: 200px;
                    height: auto;
                    filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
                }

                .title {
                    font-size: 48px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    animation: fadeInUp 1s ease-out 0.2s both;
                }

                .title-utm {
                    color: #ff6b35;
                }

                .title-report {
                    color: #ffa500;
                }

                .subtitle {
                    font-size: 20px;
                    margin-bottom: 40px;
                    opacity: 0.9;
                    animation: fadeInUp 1s ease-out 0.4s both;
                }

                .buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    animation: fadeInUp 1s ease-out 0.6s both;
                }

                .btn {
                    padding: 16px 40px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-primary {
                    background: white;
                    color: #667eea;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }

                .btn-secondary {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid white;
                }

                .btn-secondary:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }

                .features {
                    margin-top: 60px;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                    max-width: 900px;
                    margin-left: auto;
                    margin-right: auto;
                    animation: fadeInUp 1s ease-out 0.8s both;
                }

                .feature-card {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 30px;
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s;
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255,255,255,0.15);
                }

                .feature-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .feature-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .feature-desc {
                    font-size: 14px;
                    opacity: 0.9;
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .title {
                        font-size: 36px;
                    }

                    .subtitle {
                        font-size: 16px;
                    }

                    .buttons {
                        flex-direction: column;
                    }

                    .features {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .logo {
                        width: 150px;
                    }
                }
            `}</style>

            <div className="welcome-container">
                <div className="logo-container">
                    <img src="/logo.png" alt="UTM Logo" className="logo" />
                </div>

                <h1 className="title">
                    <span className="title-utm">UTM</span> <span className="title-report">REPORT</span> SYSTEM
                </h1>

                <p className="subtitle">
                    Mobile Photo Reporting Platform for Campus Safety
                </p>

                <div className="buttons">
                    <Link href="/login" className="btn btn-primary">
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    );
}
