import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MdArrowForward, MdClose } from "react-icons/md";
import ReactDOM from "react-dom";
import "./Modals.scss";

const Move = ({ setMoveModal, list, card, lists, setLists }) => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [board] = useState(JSON.parse(localStorage.getItem("board")));
  const [newListId, setNewListId] = useState("");

  const closeModal = () => {
    setMoveModal(false);
  };

  const getOneBoard = useCallback(() => {
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    axios
      .get(`/api/trello/${user["_id"]}/boards/${board["_id"]}`)
      .then((res) => {
        console.log("res", res.data.lists);
        setLists([...res.data.lists]);
        setNewListId(
          res.data.lists.filter((li) => li.title !== list.title)[0]["_id"]
        );
      })
      .catch((error) => console.log(error.response));
    return () => source.cancel();
  }, [board, user, list.title, setLists]);

  //get a board info
  useEffect(() => {
    getOneBoard();
  }, [getOneBoard]);

  const selectList = (e) => {
    setNewListId(e.target.value);
  };

  const moveCard = (e) => {
    e.preventDefault();
    let movedCard = {
      ...card,
      timestamp: new Date(),
    };
    axios
      .patch(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/?oldlistId=${list["_id"]}&&newlistId=${newListId}&&cardId=${card["_id"]}`,
        movedCard
      )
      .then((res) => {
        console.log("after move card", res.data);
        setLists([...res.data]);
      })
      .catch((error) => {
        console.log(error);
      });
    closeModal();
  };

  return ReactDOM.createPortal(
    <div className="Move">
      <div className="Move__modal">
        <div className="Move__modal-headline">
          <MdArrowForward className=" Move__icon Move__icon-remove" />
          <h5> Move card </h5>
        </div>
        {lists.length === 1 ? (
          <>
            {" "}
            <p className="Move__text">
              OBS! There is no other list to move to...
            </p>{" "}
            <div className="Move__btnCtn">
              <button className="Move__btn-close--top">
                <MdClose
                  onClick={closeModal}
                  className="Move__icon Move__icon-close"
                />
              </button>
              {/* <div onClick={closeModal} className="Move__btn Move__btn-cancel">
              Cancel
            </div>{" "} */}
            </div>
          </>
        ) : (
          <>
            <p className="Move__text">
              move <span className="Move__text-sub">{card.title}</span> from{" "}
              <span className="Move__text-sub">{list.title}</span> list to ...
            </p>

            <select
              className="Move__input Move__input-select"
              value={newListId}
              onChange={selectList}
            >
              {lists
                .filter((li) => li.title !== list.title)
                .map((li) => {
                  return (
                    <option key={li["_id"]} value={li["_id"]}>
                      {li.title}
                    </option>
                  );
                })}
            </select>

            <div className="Move__btnCtn">
              <div onClick={closeModal} className="Move__btn Move__btn-cancel">
                Cancel
              </div>

              <button
                onClick={moveCard}
                className="Remove__btn Remove__btn-remove"
              >
                Move
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Move;
