import React, { useState, useRef, useCallback, useEffect } from "react";
import "./Card.scss";
import {
  MdMenu,
  MdEdit,
  MdArrowForward,
  MdRemove,
} from "react-icons/md";
import { createDateTime } from "../../utility";
import Edit from "../Modal/Edit";
import Move from "../Modal/Move";
import Remove from "../Modal/Remove";

const Card = ({ card, cardId, list, setLists, lists }) => {
  const [dropDown, setDropDown] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [moveModal, setMoveModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const dropDownRef = useRef();

  let dropDownClass;
  if (dropDown) {
    dropDownClass = `Card__dropDown Card__dropDown-show`;
  } else {
    dropDownClass = `Card__dropDown Card__dropDown-hide`;
  }

  const showDropDown = useCallback(() => {
    setDropDown(dropDown ? false : true);
  }, [dropDown]);

  const dropDownBlur = useCallback(
    (e) => {
      if (dropDownRef.current.contains(e.target)) {
        return;
      }
      showDropDown(dropDown);
    },
    [showDropDown, dropDown]
  );

  useEffect(() => {
    if (dropDown) {
      document.addEventListener("mousedown", dropDownBlur);
    } else {
      document.removeEventListener("mousedown", dropDownBlur);
    }

    return () => {
      document.removeEventListener("mousedown", dropDownBlur);
    };
  }, [dropDown, dropDownBlur]);

  const openModal = (modal) => {
    setDropDown(false);
    switch (modal) {
      case "edit":
        setEditModal(true);
        break;

      case "move":
        setMoveModal(true);
        break;

      case "remove":
        setRemoveModal(true);
        break;

      default:
        return modal;
    }
  };

  return (
    <div className="Card">
      <div className="Card__ctn Card__ctn-info">
        <h3 className="Card__title">{card.title}</h3>
        <p className="Card__text Card__text-desc">{card.desc}</p>
        <p className="Card__text Card__text-date">
          {createDateTime(card.timestamp)}
        </p>
      </div>
      <div className="Card__ctn Card__ctn-dropDown" ref={dropDownRef}>
        <button className="Card__btn Card__btn-menu" onClick={showDropDown}>
          <MdMenu className="Card__icon Card__icon-menu" />
        </button>
        <div className={dropDownClass}>
          <button
            onClick={() => openModal("edit")}
            className="Card__btn Card__btn-edit"
          >
            <MdEdit className="Card__icon Card__icon-edit" /> Edit Card...
          </button>
          {editModal && (
            <Edit
              setEditModal={setEditModal}
              cardId={cardId}
              setLists={setLists}
              lists={lists}
              list={list}
            />
          )}
          <button
            onClick={() => openModal("move")}
            className="Card__btn Card__btn-move"
          >
            <MdArrowForward className="Card__icon Card__icon-move" /> Move
            Card...
          </button>
          {moveModal && (
            <Move
              setMoveModal={setMoveModal}
              card={card}
              list={list}
              setLists={setLists}
              lists={lists}
            />
          )}
          <button
            onClick={() => openModal("remove")}
            className="Card__btn Card__btn-remove"
          >
            <MdRemove className="Card__icon Card__icon-remove" /> Remove Card
          </button>
          {removeModal && (
            <Remove
              setRemoveModal={setRemoveModal}
              type="card"
              card={card}
              list={list}
              lists={lists}
              setLists={setLists}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
