import React, { useState, useRef, useEffect, useCallback } from "react";
import { MdAdd, MdRemove } from "react-icons/md";
import axios from "axios";
import { autoFocus } from "../../utility";
import "./List.scss";
import Card from "../Card/Card";
import Remove from "../Modal/Remove";

const List = ({ list, lists, setLists }) => {
  const [card, setCard] = useState({ title: "", desc: "" });
  const [listTitle, setListTitle] = useState(list.title);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [board] = useState(JSON.parse(localStorage.getItem("board")));
  const [addCardInput, setAddCardInput] = useState(false);
  const [listTitleInput, setListTitleInput] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const listTitleInputRef = useRef(null);
  const cardTitleInputRef = useRef(null);
  const addCardCtnRef = useRef(null);

  useEffect(() => {
    if (addCardInput) {
      autoFocus(cardTitleInputRef);
    }
  }, [addCardInput]);

  useEffect(() => {
    if (listTitleInput) {
      autoFocus(listTitleInputRef);
    }
  }, [listTitleInput]);

  const handleBlur = (e) => {
    if (listTitle !== list.title) {
      editListTitle(listTitle);
    }
    setListTitleInput(false);
  };

  const showAddCard = useCallback(() => {
    setAddCardInput(addCardInput ? false : true);
  }, [addCardInput]);

  const addCardBlur = useCallback(
    (e) => {
      if (addCardCtnRef.current.contains(e.target)) {
        return;
      }
      showAddCard(addCardInput);
    },
    [showAddCard, addCardInput]
  );

  useEffect(() => {
    if (addCardInput) {
      document.addEventListener("mousedown", addCardBlur);
    } else {
      document.removeEventListener("mousedown", addCardBlur);
    }
    return () => {
      document.removeEventListener("mousedown", addCardBlur);
    };
  }, [addCardInput, addCardBlur]);

  const getOneList = useCallback(() => {
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    axios
      .get(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}`
      )
      .then((res) => {
        let copyLists = [...lists];
        let listIndex = copyLists.findIndex((li) => li["_id"] === list["_id"]);
        copyLists[listIndex] = { ...res.data };
        setListTitle(res.data.title);
      })
      .catch((error) => {
        console.log(error.response);
      });
    return () => source.cancel();
  }, [board, list, lists, user]);

  //get one list
  useEffect(() => {
    getOneList();
  }, [getOneList]);

  const onCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const onListChange = (e) => {
    setListTitle(e.target.value);
  };

  const submitByEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      if (listTitle === list.title) {
        setListTitleInput(false);
        return;
      }
      editListTitle(listTitle);
    }
  };

  const editListTitle = useCallback((title) => {
    if (title === "" || title.length > 15) {
      console.log("hello");
      getOneList();
      return;
    }

    console.log("newTitle", title);
    axios
      .patch(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}/editTitle`,
        { title: title }
      )
      .then((res) => {
        setLists([...res.data]);
        setListTitleInput(false);
      })
      .catch((error) => console.log(error));
  }, [board, list, user, getOneList, setLists]);

  const createCard = (e) => {
    e.preventDefault();
    if (!card["title"]) return;

    setAddCardInput(false);

    let newcard = {
      title: card.title,
      desc: card.desc,
      timestamp: new Date(),
    };

    axios
      .post(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}`,
        newcard
      )
      .then((res) => {
        console.log("after created card", res.data);
        setLists([...res.data]);
        setCard({ title: "", desc: "" });
      })
      .catch((error) => {
        console.log(error.response);
      });
    setAddCardInput(false);
  };

  const hideInput = () => {
    setAddCardInput(false);
    setCard({ title: "", desc: "" });
  };

  let listTitleClass;
  let listTitleInputClass;
  if (listTitleInput) {
    listTitleClass = "List__title List__title--hide";
    listTitleInputClass =
      "List__input List__input-listTitle List__input-listTitle--show";
  } else {
    listTitleClass = "List__title List__title--show";
    listTitleInputClass =
      "List__input List__input-listTitle List__input-listTitle--hide";
  }

  let addCardClass;
  let inputCtnClass;

  if (addCardInput) {
    addCardClass = " List__btn List__btn-add List__btn-add--hide";
    inputCtnClass = "List__ctn List__ctn-input List__ctn-input--show";
  } else {
    addCardClass = " List__btn List__btn-add List__btn-add--show";
    inputCtnClass = " List__ctn List__ctn-input List__ctn-input--hide";
  }

  return (
    <div className="List">
      <div className="List__ctn List__ctn-header">
        <div className="List__ctn List__ctn-listTitle">
          <h3
            className={listTitleClass}
            onClick={() => setListTitleInput(true)}
          >
            {" "}
            {list.title}{" "}
          </h3>
          <input
            className={listTitleInputClass}
            ref={listTitleInputRef}
            onBlur={handleBlur}
            type="text"
            value={listTitle}
            onChange={onListChange}
            onKeyDown={(e) => submitByEnter(e)}
          />
        </div>
        <button
          title="remove list"
          onClick={() => setRemoveModal(true)}
          className="List__btn List__btn-delete"
        >
          <MdRemove className="List__icon-delete" />
        </button>
        {removeModal && (
          <Remove
            type="list"
            list={list}
            lists={lists}
            setLists={setLists}
            setRemoveModal={setRemoveModal}
          />
        )}
      </div>
      <div className=" List__ctn-cardsWrap">
        <div className="List__ctn List__ctn-cards">
          {list.cards.map((c) => {
            return (
              <Card
                key={c["_id"]}
                card={c}
                setCard={setCard}
                cardId={c["_id"]}
                list={list}
                lists={lists}
                setLists={setLists}
              />
            );
          })}
        </div>
        <div className="List__ctn List__ctn-add">
          <button className={addCardClass} onClick={showAddCard}>
            <MdAdd className="List__icon List__icon-add" />
          Add a card
        </button>
          <div className={inputCtnClass} ref={addCardCtnRef}>
            <input
              className="List__input List__input-cardTitle"
              type="text"
              placeholder="Title"
              name="title"
              value={card.title}
              onChange={onCardChange}
              ref={cardTitleInputRef}
            />
            <textarea
              className="List__input List__input-cardDesc"
              type="text"
              placeholder="Description"
              name="desc"
              value={card.desc}
              onChange={onCardChange}
            />
            <div className="List__ctn List__ctn-btns">
              <button className="List__btn List__btn-create" onClick={createCard}>
                Add Card
            </button>
              <button className="List__btn List__btn-cancel" onClick={hideInput}>
                Cancel
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
