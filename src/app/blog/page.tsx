"use client";
import Link from "next/link";

  const courses = [
    { name: "Java", path: "/blog/java", color: "bg-orange-600", hover: "hover:bg-orange-700" },
    { name: "JavaScript", path: "/blog/javascript", color: "bg-blue-500", hover: "hover:bg-blue-600" },
    { name: "Python", path: "/blog/python", color: "bg-green-600", hover: "hover:bg-green-700" },
    { name: "HTML/CSS", path: "/blog/html-css", color: "bg-purple-500", hover: "hover:bg-purple-600" },
  ];
  

export default function BlogPage() {
  return (
    <main className="container mx-auto p-8 bg-gray-900 text-white">
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Elige tu lenguaje</h1>
      <p className="text-center text-gray-600 mb-8">
        Explora los cursos y comparte tus preguntas o problemas con la comunidad.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Link key={course.name} href={course.path} className="text-white visited:text-white">
            <div className={`p-6 rounded-lg shadow-md text-white text-center cursor-pointer transition-all duration-300 ${course.color} ${course.hover}`}>
              <div className="flex items-center justify-center gap-3">
                {course.name === "Java" && (
                  <img src="/icons/java.svg" alt="Java" className="w-12 h-12" style={{filter: 'brightness(0) invert(1)'}} />
                )}
                {course.name === "JavaScript" && (
                  <img src="/icons/javascript.svg" alt="JavaScript" className="w-12 h-12" />
                )}
                {course.name === "Python" && (
                  <img src="/icons/python.svg" alt="Python" className="w-12 h-12" />
                )}
                {course.name === "HTML/CSS" && (
                  <img src="/icons/html.svg" alt="HTML/CSS" className="w-12 h-12" />
                )}
                <h2 className="text-xl font-semibold !text-white">{course.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </main>
  );
}
