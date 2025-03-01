"use server";

import { TimetableGenerator } from "@/lib/timetableGenerator";

export default async function GenerujPage() {
  const generator = new TimetableGenerator();
  const timetable = await generator.generate();
  return (
    <div className="p-4">
      {Object.entries(timetable).map(([id, branch]) => (
        <div key={id} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{id}</h2>
          <table className="border-collapse border w-full">
            <thead>
              <tr>
                <th className="border p-2">Godzina</th>
                {Object.keys(branch).map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(20)].map((_, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  {Object.entries(branch).map(([day, lessons]) => (
                    <td key={day} className="border p-2">
                      {lessons[index] ? (
                        <div>
                          <div>{lessons[index].przedmiot}</div>
                          <div className="text-sm text-gray-600">
                            {lessons[index].nauczyciel} - {lessons[index].sala}
                          </div>
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
