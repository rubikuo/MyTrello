import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FaList } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import axios from "axios";
import { autoFocus } from "../../utility";
import "./Board.scss";
import List from "../List/List";
import Create from "../Modal/Create";
import MemoHeader from "../Header/Header";
import { Redirect } from "react-router-dom";

const Board = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [board] = useState(JSON.parse(localStorage.getItem("board")));
  const [boardTitle, setBoardTitle] = useState(board && board.title);
  const [loading, setLoading] = useState(true);
  const [boardTitleInput, setBoardTitleInput] = useState(false);
  const [lists, setLists] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const boardTitleInputRef = useRef(null);
  const [redirect, setRedirect] = useState(false);
  const [helmetTitle, setHelmetTitle] = useState("");

  useEffect(() => {
    setHelmetTitle(board.title);
  }, [board.title]);

  useEffect(() => {
    if (boardTitleInput) {
      autoFocus(boardTitleInputRef);
    }
  }, [boardTitleInput]);

  const handleBlur = (e) => {
    if (boardTitle !== board.title) {
      editBoardTitle(boardTitle);
    }
    setBoardTitleInput(false);
  };

  const getOneBoard = useCallback(() => {
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    axios
      .get(`/api/trello/${user["_id"]}/boards/${board["_id"]}`)
      .then((res) => {
        setBoardTitle(res.data.title);
        setLists([...res.data.lists]);
        localStorage.setItem("board", JSON.stringify(res.data));
        setLoading(false);
      })
      .catch((error) => console.log(error.response));
    return () => source.cancel();
  }, [board, user]);

  //get a board info
  useEffect(() => {
    getOneBoard();
  }, [getOneBoard]);

  const onBoardChange = (e) => {
    setBoardTitle(e.target.value);
  };

  const submitByEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      // e.stopPropagation();
      if (boardTitle === board.title) {
        setBoardTitleInput(false);
        return;
      }
      editBoardTitle(boardTitle);
    }
  };

  const editBoardTitle = useCallback((title) => {
    if (title === "" || title.length > 15) {
      console.log("hello");
      getOneBoard();
      return;
    }

    axios
      .patch(`/api/trello/${user["_id"]}/boards/${board["_id"]}/editTitle`, {
        title: title,
      })
      .then((res) => {
        localStorage.setItem("board", JSON.stringify(res.data));
        setBoardTitleInput(false);
      })
      .catch((error) => console.log(error));
  }, [board, getOneBoard, user]);

  let boardTitleClass;
  let boardTitleInputClass;
  if (boardTitleInput) {
    boardTitleClass = "Board__title Board__title--hide";
    boardTitleInputClass =
      "Board__input Board__input-boardTitle Board__input-boardTitle--show";
  } else {
    boardTitleClass = "Board__title Board__title--show";
    boardTitleInputClass =
      "Board__input Board__input-boardTitle Board__input-boardTitle--hide";
  }

  const logout = (e) => {
    e.preventDefault();
    console.log("log out");
    axios.post("/auth/trello/logout").then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        localStorage.setItem("user", null);
        localStorage.setItem("board", null);
        setRedirect(true);
      }
    });
  };
  if (redirect || !board) {
    return <Redirect to="/" />;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>MyTrello - Board: {helmetTitle}</title>
      </Helmet>
      <MemoHeader page="board" logout={logout} user={user} />
      <div className="Board">
        {loading ? null : (
          <div className="Board__ctn Board__ctn-wrap">
            <div className="Board__ctn Board__ctn-header">
              <div className="Board__ctn Board__ctn-boardTitle">
                <h2
                  onClick={() => setBoardTitleInput(true)}
                  className={boardTitleClass}
                >
                  {boardTitle}
                </h2>
                <input
                  className={boardTitleInputClass}
                  onBlur={handleBlur}
                  ref={boardTitleInputRef}
                  type="text"
                  onChange={onBoardChange}
                  onKeyDown={(e) => submitByEnter(e)}
                  value={boardTitle}
                />
              </div>
              <span className="Board__divider"></span>
              <button
                className="Board__btn Board__btn-create"
                onClick={() => setCreateModal(true)}
              >
                <MdAdd className="Board__icon Board__icon-add" /> Create new
                list
              </button>
            </div>
            <div className="Board__ctn Board__ctn-lists">
              {lists.length === 0 ? (
                <div className="Board__ctn Board__ctn-noList">
                  <h1 className="Board__title-noList">
                    <FaList className="Board__icon-list" /> No list
                  </h1>
                </div>
              ) : (
                lists.map((list) => {
                  return (
                    <div
                      className="Board__ctn Board__ctn-list"
                      key={list["_id"]}
                    >
                      <List list={list} lists={lists} setLists={setLists} />{" "}
                    </div>
                  );
                })
              )}
            </div>

            {createModal && (
              <Create
                setCreateModal={setCreateModal}
                userId={user["_id"]}
                board={board}
                setLists={setLists}
                option="list"
              />
            )}
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default Board;
