import React, { useState, useEffect, useCallback } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import "./Boards.scss";
import Create from "../Modal/Create";
import { useHistory, Redirect } from "react-router-dom";
import MemoHeader from "../Header/Header";
import { MdRemove } from "react-icons/md";
import { FaTrello } from "react-icons/fa";
import Remove from "../Modal/Remove";

const Boards = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  let history = useHistory();
  const [helmetTitle, setHelmetTitle] = useState("");

  useEffect(() => {
    setHelmetTitle("Boards");
  }, []);

  const getBoards = useCallback(() => {
    if (!user) return;
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    axios
      .get(`/api/trello/${user["_id"]}/boards`)
      .then((res) => {
        console.log(res.data.boards);
        setBoards(res.data.boards);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.status === 409) {
          setRedirect(true);
          localStorage.setItem("user", null);
          localStorage.setItem("board", null);
        }
      });
    return () => source.cancel();
    // check if user is null then user._id is valid
  }, [user]);

  useEffect(() => {
    getBoards();
  }, [getBoards]);

  const showRemoveModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRemoveModal(true);
  };

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

  if (redirect || !user) {
    return <Redirect to="/" />;
  }

  const renderBoard = (e, board) => {
    e.stopPropagation();
    e.preventDefault();
    localStorage.setItem("board", JSON.stringify(board));
    history.push(`/trello/${user.urlUserName}/boards/${board["_id"]}`);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>MyTrello - {helmetTitle}</title>
      </Helmet>
      <MemoHeader page="boards" logout={logout} user={user} />

      <div className="Boards">
        {loading ? null : (
          <div className="Boards__ctn Boards__ctn-wrap">
            {boards.length === 0 ? (
              <h1 className="Boards__title-noBoard">
                <FaTrello className="Boards__icon-trello" /> No board
              </h1>
            ) : (
              boards.map((board) => {
                return (
                  <div
                    key={board["_id"]}
                    className="Boards__box Boards__box-board"
                    onClick={(e) => renderBoard(e, board)}
                  >
                    {board.title}
                    <button
                      title="remove board"
                      onClick={showRemoveModal}
                      className="Boards__btn Boards__btn-delete"
                    >
                      <MdRemove className="Boards__icon-delete" />
                    </button>
                    {removeModal && (
                      <Remove
                        type="board"
                        _board={board}
                        boards={boards}
                        setBoards={setBoards}
                        setRemoveModal={setRemoveModal}
                      />
                    )}
                  </div>
                );
              })
            )}

            <div
              className="Boards__box Boards__box-addBoard"
              onClick={() => setCreateModal(true)}
            >
              Create new board
            </div>
            {createModal && (
              <Create
                setCreateModal={setCreateModal}
                userId={user["_id"]}
                setBoards={setBoards}
                option="board"
              />
            )}
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default Boards;
