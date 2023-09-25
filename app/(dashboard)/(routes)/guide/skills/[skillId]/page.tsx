const SkillPage = ({
    params
}: {
    params: {skillId: string}
}) => {
    return (
        <div className="">
            Skill Id: {params.skillId}
        </div>
    );
}
 
export default SkillPage;