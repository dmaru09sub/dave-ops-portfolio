
import { Card, CardContent } from "@/components/ui/card";

const SkillsSection = () => {
  const skillCategories = [
    {
      name: "Frontend",
      skills: [
        { name: "React", proficiency: 90 },
        { name: "Vue.js", proficiency: 80 },
        { name: "Angular", proficiency: 70 },
        { name: "HTML/CSS", proficiency: 95 },
        { name: "JavaScript/TypeScript", proficiency: 90 },
      ]
    },
    {
      name: "Backend",
      skills: [
        { name: "Node.js", proficiency: 85 },
        { name: "Express", proficiency: 80 },
        { name: "Django", proficiency: 70 },
        { name: "Ruby on Rails", proficiency: 65 },
      ]
    },
    {
      name: "Database",
      skills: [
        { name: "MongoDB", proficiency: 85 },
        { name: "PostgreSQL", proficiency: 80 },
        { name: "MySQL", proficiency: 75 },
        { name: "Firebase", proficiency: 85 },
      ]
    },
    {
      name: "DevOps & Tools",
      skills: [
        { name: "Git", proficiency: 90 },
        { name: "Docker", proficiency: 75 },
        { name: "AWS", proficiency: 70 },
        { name: "CI/CD", proficiency: 80 },
      ]
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {skillCategories.map((category) => (
        <Card key={category.name}>
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">{category.name}</h3>
            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SkillsSection;
