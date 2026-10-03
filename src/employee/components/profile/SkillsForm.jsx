import { useState } from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function SkillsForm() {

    const [skills, setSkills] = useState([
        {
            id: 1,
            name: "React.js",
            level: "Advanced",
            progress: 90,
        },
        {
            id: 2,
            name: "JavaScript",
            level: "Advanced",
            progress: 85,
        },
        {
            id: 3,
            name: "HTML",
            level: "Advanced",
            progress: 95,
        },
        {
            id: 4,
            name: "CSS",
            level: "Intermediate",
            progress: 75,
        },
    ]);

    const [skillName, setSkillName] = useState("");

    const [skillLevel, setSkillLevel] = useState("Beginner");

    const [progress, setProgress] = useState(50);

    const [editingId, setEditingId] = useState(null);

    const addSkill = () => {

       if (skillName.trim() === "") {
    toast.error("Please enter a skill.");
    return;
}

        const newSkill = {
            id: Date.now(),
            name: skillName,
            level: skillLevel,
            progress: 50,
        };

        setSkills([...skills, newSkill]);

        setSkillName("");

        setSkillLevel("Beginner");

    };

    const deleteSkill = (id) => {

        const updatedSkills = skills.filter((skill) => {

            return skill.id !== id;

        });

        setSkills(updatedSkills);

    };

    const editSkill = (skill) => {

        setSkillName(skill.name);

        setSkillLevel(skill.level);

        setProgress(skill.progress);

        setEditingId(skill.id);

    };

    const updateSkill = () => {

        const updatedSkills = skills.map((skill) => {

            if (skill.id === editingId) {

                return {

                    ...skill,

                    name: skillName,

                    level: skillLevel,

                    progress: progress,

                };

            }

            return skill;

        });

        setSkills(updatedSkills);

        setSkillName("");

        setSkillLevel("Beginner");

        setProgress(50);

        setEditingId(null);

    };

    return (
        <Card className="p-6">
            <div className="mb-5">
                <h2 className="text-base font-semibold">Skills</h2>
                <p className="text-sm text-muted-foreground">Manage your technical skills</p>
            </div>

            <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-muted/30 p-4">
                <Field className="w-32">
                    <FieldLabel>Progress</FieldLabel>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => setProgress(e.target.value)}
                            className="w-full accent-primary"
                        />
                        <span className="w-9 shrink-0 text-xs text-muted-foreground">{progress}%</span>
                    </div>
                </Field>

                <Field className="min-w-[180px] flex-1">
                    <FieldLabel>Skill Name</FieldLabel>
                    <Input
                        type="text"
                        placeholder="Enter Skill"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                    />
                </Field>

                <Field className="w-40">
                    <FieldLabel>Level</FieldLabel>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                        <SelectTrigger />
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Button onClick={editingId ? updateSkill : addSkill}>
                    {editingId ? "Update Skill" : "Add Skill"}
                </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skills.map((skill) => (
                    <div key={skill.id} className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="text-sm font-medium">{skill.name}</h3>
                                <Badge variant="outline" className="mt-1">
                                    {skill.level}
                                </Badge>
                            </div>

                            <div className="flex shrink-0 gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => editSkill(skill)}>
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteSkill(skill.id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${skill.progress}%` }}
                            ></div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{skill.progress}%</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default SkillsForm;