"use client";
import Link from "next/link";

const courses = [
  { name: "Java", path: "/blog/java" },
  { name: "JavaScript", path: "/blog/javascript" },
  { name: "Python", path: "/blog/python" },
  { name: "HTML/CSS", path: "/blog/html-css" },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Blog de Programación</h1>
      <p className="text-center text-gray-600 mb-8">
        Explora los cursos y comparte tus preguntas o problemas con la comunidad.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Link key={course.name} href={course.path}>
            <div className="p-6 border rounded-lg shadow-sm bg-white hover:bg-gray-100 cursor-pointer text-center">
              <h2 className="text-xl font-semibold">{course.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
