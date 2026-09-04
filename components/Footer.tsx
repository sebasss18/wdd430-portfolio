export default function Footer() {  
  return (
    <footer className="bg-gray-800 text-white py-4 mt-12">
      <div className="container mx-auto text-center">
        <p>Copyright &copy; {new Date().getFullYear()} | Sebastian Bernal | All rights reserved</p>
      </div>
    </footer>
  );
}