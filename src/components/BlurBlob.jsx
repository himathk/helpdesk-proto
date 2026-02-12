const BlurBlob = ({ className }) => {
  return (
    <div className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob ${className}`}></div>
  );
};

export default BlurBlob;
