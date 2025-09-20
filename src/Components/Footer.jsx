
// import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/assets/logo1.jpg";

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
//       {/* Enhanced Background Effects */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-600/10 via-transparent to-transparent"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-500/5 via-transparent to-transparent"></div>
        
//         {/* Decorative Grid */}
//         <div 
//           className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage: 'linear-gradient(rgba(156,163,175,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156,163,175,0.1) 1px, transparent 1px)',
//             backgroundSize: '60px 60px'
//           }}
//         ></div>
        
//         {/* Floating Elements */}
//         <div className="absolute top-20 left-10 w-32 h-32 bg-gray-600/5 rounded-full blur-xl animate-pulse"></div>
//         <div className="absolute bottom-32 right-16 w-40 h-40 bg-gray-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
//       </div>
      
//       <div className="relative z-10">
//         {/* Main Footer Content */}
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
//             {/* Enhanced Logo & Company Info Section */}
//             <div className="lg:col-span-1 space-y-6">
//               <div className="group cursor-pointer">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
//                     <span className="text-white font-bold text-xl">Q</span>
//                   </div>
//                   <h1 className="text-3xl font-bold text-white group-hover:text-[#00d9a6] transition-all duration-300">
//                     QuoreIT
//                   </h1>
//                 </div>
//                 <div className="w-16 h-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full transform group-hover:w-24 transition-all duration-500"></div>
//               </div>
              
//               <p className="text-gray-300 text-base leading-relaxed max-w-sm">
//                 Connecting exceptional technology talent with innovative organizations worldwide. Your strategic partner for growth and success.
//               </p>
              
//               {/* Contact Info */}
//               <div className="space-y-4 pt-4">
//                 <div className="flex items-center text-gray-300 hover:text-[#00d9a6] transition-colors duration-300 group">
//                   <Mail className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
//                   <span className="text-sm">info@quoreit.com</span>
//                 </div>
//                 <div className="flex items-center text-gray-300 hover:text-[#00d9a6] transition-colors duration-300 group">
//                   <Phone className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
//                   <span className="text-sm">+1 (555) 123-4567</span>
//                 </div>
//                 <div className="flex items-center text-gray-300 hover:text-[#00d9a6] transition-colors duration-300 group">
//                   <MapPin className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
//                   <span className="text-sm">Global Offices Worldwide</span>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Quick Links */}
//             <div className="space-y-6">
//               <h3 className="text-xl font-bold mb-6 text-white relative pb-2">
//                 Services
//                 <div className="absolute bottom-0 left-0 w-12 h-0.2 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"></div>
//               </h3>
//               <ul className="space-y-1">
//                 {[
//                   { label: "Find Tech Jobs", path: "/Find-tech-jobs", description: "Discover opportunities" },
//                   { label: "Submit Vacancy", path: "/Find-tech-talent", description: "Find talent" },
//                   { label: "What We Do", path: "/What-we-do", description: "Our services" },
//                   { label: "NEWS & EVENTS", path: "https://quore-it-ai-blogs.vercel.app/", description: "Strategic consulting" },
//                    { label: "ABOUT US", path: "/About-Us", description: "Strategic consulting" },
//                   { label: "Contact Us", path: "/Contact-us", description: "Get in touch" },
//                 ].map(({ label, path, description }, idx) => (
//                   <li key={idx} className="group">
//                     <Link
//                       href={path}
//                       className="block p-3 rounded-lg hover:bg-white/5 transition-all duration-300 transform hover:translate-x-2"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <div className="text-gray-200 group-hover:text-[#00d9a6] transition-colors duration-300 font-medium flex items-center">
//                             <ArrowRight className="w-0 h-4 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />
//                             {label}
//                           </div>
//                           <div className="text-gray-400 text-xs mt-1 group-hover:text-gray-300 transition-colors duration-300">
//                             {description}
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Enhanced Resources & Policies */}
//             <div className="space-y-6">
//               <h3 className="text-xl font-bold mb-6 text-white relative pb-3">
//                 Resources
//                 <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"></div>
//               </h3>
//               <ul className="space-y-4">
//                 {[
//                   { label: "News & Insights", path: "https://quore-it-ai-blogs.vercel.app/", description: "Latest trends", external: true },
//                   { label: "Privacy Policy", path: "/Policies/Privacy-Policy", description: "Data protection" },
//                   { label: "Terms of Service", path: "/Policies/Terms-of-Service", description: "Usage terms" },
//                   { label: "Cookies & Legal", path: "/Policies/Cookies-Legal", description: "Legal information" },
//                   { label: "Modern Slavery", path: "/Policies/Modern-Slavery-Statement", description: "Our commitment" },
//                 ].map(({ label, path, description, external }, idx) => (
//                   <li key={idx} className="group">
//                     <Link
//                       href={path}
//                       {...(external && { target: "_blank", rel: "noopener noreferrer" })}
//                       className="block p-3 rounded-lg hover:bg-white/5 transition-all duration-300 transform hover:translate-x-2"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <div className="text-gray-200 group-hover:text-[#00d9a6] transition-colors duration-300 font-medium flex items-center">
//                             <ArrowRight className="w-0 h-4 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />
//                             {label}
//                             {external && <span className="ml-1 text-xs">↗</span>}
//                           </div>
//                           <div className="text-gray-400 text-xs mt-1 group-hover:text-gray-300 transition-colors duration-300">
//                             {description}
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Enhanced Social Media & Newsletter */}
//             <div className="space-y-6">
//               <h3 className="text-xl font-bold mb-6 text-white relative pb-3">
//                 Stay Connected
//                 <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"></div>
//               </h3>
              
//               {/* Social Media Icons */}
//               <div className="flex gap-4 mb-8">
//                 {[
//                   { Icon: Facebook, label: "Facebook", href: "#", color: "hover:bg-gray-600" },
//                   { Icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:bg-gray-600" },
//                   { Icon: Twitter, label: "Twitter", href: "#", color: "hover:bg-gray-600" },
//                 ].map(({ Icon, label, href, color }, idx) => (
//                   <Link
//                     key={idx}
//                     href={href}
//                     aria-label={label}
//                     className={`group relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl ${color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg`}
//                   >
//                     <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
//                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </Link>
//                 ))}
//               </div>

//               {/* Trust Indicators */}
//               <div className="space-y-3 pt-4">
//                 <div className="flex items-center text-gray-400 text-sm">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 animate-pulse"></div>
//                   <span>Trusted by 500+ companies worldwide</span>
//                 </div>
//                 <div className="flex items-center text-gray-400 text-sm">
//                   <div className="w-2 h-2 bg-gray-500 rounded-full mr-3 animate-pulse delay-500"></div>
//                   <span>25+ years of industry expertise</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Divider */}
//         <div className="relative mx-6 lg:mx-8">
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent h-px"></div>
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent h-px transform translate-y-px"></div>
//         </div>

//         {/* Enhanced Bottom Section */}
//         <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 py-8">
//           <div className="max-w-7xl mx-auto px-6 lg:px-8">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
//               {/* Enhanced Copyright */}
//               <div className="flex flex-col sm:flex-row items-center gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="group cursor-pointer flex items-center">
//                     <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
//                       <span className="text-white font-bold text-sm">Q</span>
//                     </div>
//                     <h1 className="text-xl font-bold text-white group-hover:text-[#00d9a6] transition-colors duration-300">
//                       QuoreIT
//                     </h1>
//                   </div>
//                   <div className="hidden sm:block h-6 w-px bg-gray-500"></div>
//                   <p className="text-gray-400 text-sm">
//                     © 2025 QuoreIT. All Rights Reserved
//                   </p>
//                 </div>
//               </div>

//               {/* Enhanced Additional Info */}
//               <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
//                 <div className="flex items-center gap-2 text-gray-400 hover:text-[#00d9a6] transition-colors duration-300 cursor-pointer">
//                   <span>Made with</span>
//                   <Heart className="w-4 h-4 text-red-400 animate-pulse" fill="currentColor" />
//                   <span>for Tech Professionals</span>
//                 </div>
                
//                 <div className="flex items-center gap-6">
//                   <div className="flex items-center gap-2">
//                     <div className="relative">
//                       <div className="w-3 h-3 bg-gray-400 rounded-full animate-ping"></div>
//                       <div className="absolute inset-0 w-3 h-3 bg-gray-400 rounded-full"></div>
//                     </div>
//                     <span className="text-gray-400 text-xs">System Online</span>
//                   </div>
                  
//                   <div className="text-gray-400 text-xs">
//                     Last updated: September 2025
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Bottom Info */}
//             <div className="mt-6 pt-6 border-t border-gray-600/30">
//               <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                
//                 <div className="text-center lg:text-right">
//                   <p> GDPR Compliant | Equal Opportunity Employer</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Back to Top Button */}
     
//     </footer>
//   );
// }

import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Heart, 
  ChevronUp, 
  Globe, 
  Shield, 
  Clock, 
  Users,
  Rocket,
  Target,
  Zap,
  Newspaper,
  MessageCircle,
  Lock,
  FileText,
  Scale,
  Handshake,
  BarChart3,
  Send
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Professional Background Effects */}
      <div className="absolute inset-0">
        {/* Primary Gradient Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_0%,rgba(34,197,94,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_300px_at_80%_100%,rgba(16,185,129,0.08),transparent)]"></div>
        
        {/* Professional Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 70%)'
          }}
        ></div>
        
        {/* Subtle Floating Elements */}
        <div className="absolute top-32 left-16 w-64 h-64 bg-gradient-to-r from-green-500/8 to-emerald-500/6 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-r from-emerald-500/6 to-green-500/4 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-green-400/4 to-emerald-400/3 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10">
        
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-1 space-y-8">
              <div className="group cursor-pointer">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-500 shadow-2xl border border-slate-600/30">
                      <span className="text-white font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Q</span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      QuoreIT
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Tech Excellence</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform group-hover:w-32 transition-all duration-700"></div>
                  <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse opacity-50"></div>
                </div>
              </div>
              
              <p className="text-slate-300 text-base leading-relaxed max-w-sm">
                Pioneering the future of technology recruitment. Connecting visionary talent with revolutionary organizations across the globe.
              </p>
              
              {/* Professional Contact Grid */}
              <div className="space-y-5 pt-6">
                {[
                  { Icon: Mail, text: "info@quoreit.com", label: "Email" },
                  { Icon: Phone, text: "+1 (555) 123-4567", label: "Phone" },
                  { Icon: MapPin, text: "Global Offices Worldwide", label: "Location" }
                ].map(({ Icon, text, label }, idx) => (
                  <div key={idx} className="flex items-center text-slate-300 hover:text-green-400 transition-all duration-300 group cursor-pointer">
                    <div className="relative">
                      <div className="w-9 h-9 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-500/10 transition-all duration-300">
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{text}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm">500+ Companies Trust Us</span>
                </div>
              </div>
            </div>

            {/* Professional Services Section */}
            <div className="space-y-8">
              <div className="relative">
                <h3 className="text-2xl font-bold mb-8 text-white relative pb-4">
                  Services
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                </h3>
              </div>
              
              <ul className="space-y-2">
                {[
                  { label: "Find Tech Jobs", path: "/Find-tech-jobs", description: "Discover your next opportunity", Icon: Rocket },
                  { label: "Submit Vacancy", path: "/Find-tech-talent", description: "Find exceptional talent", Icon: Users },
                  { label: "What We Do", path: "/What-we-do", description: "Our comprehensive services", Icon: Zap },
                  { label: "News & Events", path: "https://quore-it-ai-blogs.vercel.app/", description: "Latest industry insights", Icon: Newspaper },
                  { label: "About Us", path: "/About-Us", description: "Our story and mission", Icon: Target },
                  { label: "Contact Us", path: "/Contact-us", description: "Get in touch today", Icon: MessageCircle },
                ].map(({ label, path, description, Icon }, idx) => (
                  <li key={idx} className="group">
                    <Link
                      href={path}
                      className="block p-4 rounded-2xl hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/30 backdrop-blur-sm transition-all duration-500 transform hover:translate-x-3 hover:scale-105 border border-transparent hover:border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-green-500/10 transition-all duration-300">
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-green-400 group-hover:scale-125 transition-all duration-300" />
                          </div>
                          <div>
                            <div className="text-slate-200 group-hover:text-green-400 transition-colors duration-300 font-semibold flex items-center gap-2">
                              {label}
                              <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                            </div>
                            <div className="text-slate-500 text-xs mt-1 group-hover:text-slate-400 transition-colors duration-300">
                              {description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Resources Section */}
            <div className="space-y-8">
              <div className="relative">
                <h3 className="text-2xl font-bold mb-8 text-white relative pb-4">
                  Resources
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                </h3>
              </div>
              
              <ul className="space-y-2">
                {[
                  { label: "News & Insights", path: "https://quore-it-ai-blogs.vercel.app/", description: "Latest industry trends", external: true, Icon: BarChart3 },
                  { label: "Privacy Policy", path: "/Policies/Privacy-Policy", description: "Data protection standards", Icon: Lock },
                  { label: "Terms of Service", path: "/Policies/Terms-of-Service", description: "Usage guidelines", Icon: FileText },
                  { label: "Cookies & Legal", path: "/Policies/Cookies-Legal", description: "Legal compliance", Icon: Scale },
                  { label: "Modern Slavery", path: "/Policies/Modern-Slavery-Statement", description: "Our ethical commitment", Icon: Handshake },
                ].map(({ label, path, description, external, Icon }, idx) => (
                  <li key={idx} className="group">
                    <Link
                      href={path}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="block p-4 rounded-2xl hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/30 backdrop-blur-sm transition-all duration-500 transform hover:translate-x-3 hover:scale-105 border border-transparent hover:border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-green-500/10 transition-all duration-300">
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-green-400 group-hover:scale-125 transition-all duration-300" />
                          </div>
                          <div>
                            <div className="text-slate-200 group-hover:text-green-400 transition-colors duration-300 font-semibold flex items-center gap-2">
                              {label}
                              {external && <span className="text-xs">↗</span>}
                              <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                            </div>
                            <div className="text-slate-500 text-xs mt-1 group-hover:text-slate-400 transition-colors duration-300">
                              {description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Connect Section */}
            <div className="space-y-8">
              <div className="relative">
                <h3 className="text-2xl font-bold mb-8 text-white relative pb-4">
                  Stay Connected
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                </h3>
              </div>
              
              {/* Professional Social Media Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { Icon: Facebook, label: "Facebook", href: "#" },
                  { Icon: Linkedin, label: "LinkedIn", href: "#" },
                  { Icon: Twitter, label: "Twitter", href: "#" },
                ].map(({ Icon, label, href }, idx) => (
                  <Link
                    key={idx}
                    href={href}
                    aria-label={label}
                    className="group relative p-5 bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-3xl border border-slate-700/30 hover:border-green-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-green-400 transition-all duration-300 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                ))}
              </div>
              {/* Professional Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                {[
                  { icon: Users, value: "500+", label: "Companies" },
                  { icon: Globe, value: "25+", label: "Countries" },
                  { icon: Shield, value: "99.9%", label: "Uptime" },
                  { icon: Clock, value: "24/7", label: "Support" },
                ].map(({ icon: Icon, value, label }, idx) => (
                  <div key={idx} className="group text-center p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/20 hover:border-green-500/40 transition-all duration-300">
                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-green-400 mx-auto mb-2 transition-colors duration-300" />
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Divider */}
        <div className="relative mx-6 lg:mx-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/60 to-transparent h-px"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent h-px"></div>
          <div className="absolute left-1/2 top-0 w-32 h-px bg-gradient-to-r from-green-500 to-emerald-500 transform -translate-x-1/2"></div>
        </div>

        {/* Professional Bottom Section */}
        <div className="bg-gradient-to-r from-slate-900/80 via-gray-900/60 to-slate-900/80 backdrop-blur-sm py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Professional Copyright */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="group cursor-pointer flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <span className="text-white font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Q</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      QuoreIT
                    </h1>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-slate-600 to-transparent"></div>
                  <p className="text-slate-400 text-base font-medium">
                    © 2025 QuoreIT. All Rights Reserved
                  </p>
                </div>
              </div>

              {/* Professional Status Indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-8 text-sm">
                <div className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors duration-300 cursor-pointer group">
                  <span>Made with</span>
                  <Heart className="w-5 h-5 text-red-400 animate-pulse fill-current group-hover:scale-125 transition-transform duration-300" />
                  <span>for Tech Professionals</span>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-slate-400 text-sm font-medium">System Online</span>
                  </div>
                  
                  <div className="text-slate-500 text-sm">
                    Updated: September 2025
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Compliance Bar */}
            <div className="mt-8 pt-8 border-t border-slate-700/40">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-slate-500">
                <div className="flex flex-wrap items-center gap-6">
                  <span className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300">
                    <Shield className="w-4 h-4 text-green-400" />
                    GDPR Compliant
                  </span>
                  <span className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300">
                    <Users className="w-4 h-4 text-green-400" />
                    Equal Opportunity Employer
                  </span>
                  
                </div>
                
                <div className="text-center lg:text-right">
                  <p className="text-slate-400">Pioneering Technology Recruitment Since 1999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Back to Top Button */}
      
    </footer>
  );
}
