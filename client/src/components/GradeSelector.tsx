import { Button } from "@/components/ui/button";

interface GradeSelectorProps {
  selectedGrade: number;
  onGradeChange: (grade: number) => void;
}

export default function GradeSelector({ selectedGrade, onGradeChange }: GradeSelectorProps) {
  const grades = [3, 4, 5];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Select Your Grade</h3>
      <div className="flex space-x-4">
        {grades.map((grade) => (
          <Button
            key={grade}
            onClick={() => onGradeChange(grade)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              selectedGrade === grade
                ? "bg-primary text-white border-2 border-primary"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            Grade {grade}
          </Button>
        ))}
      </div>
    </div>
  );
}
