import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios"
import "./Vote.css"

export const VoteType = {
    NONE: 0,
    UPVOTE: 1,
    DOWNVOTE: -1
}

export default function Vote({
    voteType, hollowIcon,
    setVote, setVoteErrorMsg, setUpdatedAuthor, setUpdatedLinkedModel,
    linkedId,
    existingVote = null
}) {
    const { user } = useContext(Context);
    const [scoreChange, setScoreChange] = useState(0);
    const [voteIconClasses, setVoteIconClasses] = useState("");

    //const [voteIconSpecifics, setVoteIconSpecifics] = useState(0);
    /*const VoteIconSpecifics = {
        HOLLOW_UPVOTE: 0,
        SOLID_UPVOTE: 1,
        HOLLOW_DOWNVOTE: 2,
        SOLID_DOWNVOTE: 3
    };*/

    useEffect(() => {

        const getScore = () => {

            //if upvote
            if (voteType === VoteType.UPVOTE) {
                
                //if hollow upvote
                if (hollowIcon) {
                    setScoreChange(VoteType.UPVOTE);
                } 
                //if solid upvote
                else {
                    setScoreChange(VoteType.NONE);
                }
            }
            //if downvote
            else if (voteType === VoteType.DOWNVOTE) {
                
                //if hollow downvote
                if (hollowIcon) {
                    setScoreChange(VoteType.DOWNVOTE);
                } 
                //if solid downvote
                else {
                    setScoreChange(VoteType.NONE);
                }
            }
        }
        getScore();
        
    }, [voteType, user?.reputation, hollowIcon])

    useEffect(() => {
        const chooseVoteIconClasses = () => {

            let classNames = "";
            let iconScore = 0;
    
            //assign icon type
            if (voteType === VoteType.UPVOTE) {
                classNames += 'fa-thumbs-up ';
                //solid upvote is 1 score
                iconScore = VoteType.UPVOTE;
            }
            else if (voteType === VoteType.DOWNVOTE) {
                classNames += 'fa-thumbs-down ';
                //solid downvote is -1 score
                iconScore = VoteType.DOWNVOTE;
            }
    
            //assign icon coloring
            if (hollowIcon) {
                classNames += 'fa-regular ';
                //either downvote or upvote score is a 0
                iconScore = VoteType.NONE;
            }
            else {
                classNames += 'fa-solid ';
            }
    
            //if any vote cast
            if (existingVote) {
                //if vote cast is equal to icon score
                if (existingVote.score === iconScore) {
                    //show icon
                    classNames += "icon-lock";
                }
                else
                {
                    classNames += "icon-unlock";
                }
            }
            //if no vote cast
            else
            {
                //if clear icon
                if (hollowIcon) {
                    //show icon
                    classNames += "icon-lock";
                }
                else
                {
                    classNames += "icon-unlock";
                } 
            }
    
            setVoteIconClasses(classNames);
        }
        chooseVoteIconClasses();

    }, [existingVote, hollowIcon, voteType])
    
    const handleVote = async () => {

        const reputationRequirements = {
            downVote: 50,
            upVote: 10
        };

        setVoteErrorMsg("");

        //if upvote
        if (voteType === VoteType.UPVOTE) {
            //if user rep is too low
            if (user.reputation < reputationRequirements.upVote) {
                setVoteErrorMsg(
                    `You need atleast ${reputationRequirements.upVote} 
                    reputation to cast an up-vote. 
                    (Try creating a highly reputed post or comment to increase your reputation)`
                );
                return;
            }
        }
        //if downvote
        else if (voteType === VoteType.DOWNVOTE) {
            //if user rep is too low
            if (user.reputation < reputationRequirements.downVote) {
                setVoteErrorMsg(
                    `You need atleast ${reputationRequirements.downVote} 
                    reputation to cast a down-vote.`
                );
                return;
            }
        }

        //console.log(score);

        let updateVote = {
            score: scoreChange,
            linkedId: linkedId,
            username: user.username
        };

        let voteObject;

        //let changeInVoteScoring;

        try {

            if (existingVote) {

                updateVote["voteId"] = existingVote._id;

                //update vote w/ new score
                voteObject = await axios.put(`/votes/update/${existingVote._id}`, updateVote);

                //changeInVoteScoring = voteObject.data.vote.score - existingVote.score
            }
            else
            {
                //create new vote
                voteObject = await axios.post("/votes/vote", updateVote); 

                //changeInVoteScoring = voteObject.data.vote.score;
            }

            //if linkedModel badgeName, update it locally 
            if (voteObject.data.linkedModel.badgeName) {
                //post["badgeName"] = voteObject.data.linkedModel.badgeName;
                setUpdatedLinkedModel(voteObject.data.linkedModel);
            }

            if (Object.keys(voteObject.data.updatedAuthor).length > 0) {
                //need to update sidebar user reputation
                console.log("Sidebar author rep should be updated");
                setUpdatedAuthor(voteObject.data.updatedAuthor);
            }

            //set new vote properly
            setVote(voteObject.data.vote);

            //change local post rep score
            //setRepScore(repScore + changeInVoteScoring);

        } catch (error) {
            console.log(error);
        } 
    };

    return (
        <i 
            className={`voteScoringIcon ${voteIconClasses}`}
            onClick={() => {handleVote() }}
        ></i>
    )
}