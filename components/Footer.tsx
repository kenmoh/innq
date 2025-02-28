import { Mail, XIcon, Phone, MapPin, Facebook } from "lucide-react";
import Link from "next/link";


const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold ">
              InnQ
            </h3>
            <p className="text-sm text-gray-400">
              Transforming hotel and restaurant service experiences through innovative QR-based solutions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">Register</Link></li>
              <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@roomservicemagic.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>123 Hotel Street, NY 10001</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <XIcon className="w-5 h-5" />
              </a>
              <a href="https:.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} RoomService Magic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;