<?php

header("Access-Control-Allow-Origin: *");

try {
  $db = new PDO('mysql:host=localhost;dbname=todo', 'root', '');
} catch (PDOException $e) {
  die($e->getMessage());
}

$data = json_decode(file_get_contents('php://input'), true);

print_r($data);

$action = $_POST['action'];

switch ($action) {

    // todoları listele
  case 'todos':

    $query = $db->query('select * from todo order by id desc')->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($query);
    break;

    // yeni todo ekleme
  case 'add-todo':

    $todo = $_POST['todo'];
    $data = [
      'todo' => $todo,
      'done' => 0
    ];

    $query = $db->prepare('INSERT INTO todo SET todo = :todo, done = :done');
    $insert = $query->execute($data);

    if ($insert) {
      $data['id'] = $db->lastInsertId();
      echo json_encode($data);
    } else {
      $data['error'] = 'Veritabanına ekleme işlemi başarısız oldu.';
    }
    break;

    # buraya case 'delete-todo' ekle bu case frontendde sil butonuna tıklandığında tüm todoları silmeye yarıyor.
  case 'delete-todo':
    $query = $db->prepare('DELETE FROM todo');
    $delete = $query->execute();

    if ($delete) {
      echo json_encode('Tüm todolar silindi.');
    } else {
      echo json_encode('Tüm todolar silinemedi.');
    }
    break;

    # buraya case 'delete-todo-by-id' ekle bu case frontendde sil butonuna tıklandığında seçili olan todoyu silmeye yarıyor.
  case 'delete-todo-by-id':
    $id = $_POST['id'];
    $query = $db->prepare('DELETE FROM todo WHERE id = :id');
    $delete = $query->execute(['id' => $id]);

    if ($delete) {
      echo json_encode('Seçili todo silindi.');
    } else {
      echo json_encode('Seçili todo silinemedi.');
    }
    break;

  case 'done-todo':
    $id = $_POST['id'];
    $done = (int)$_POST['done']; // done değerini integer olarak al


    // done değerini güncelleme sorgusu
    $query = $db->prepare('UPDATE todo SET done = :done WHERE id = :id');
    $update = $query->execute(['id' => $id, 'done' => $done]);

    if ($update) {
      echo json_encode('Seçili todo güncellendi.');
    } else {
      echo json_encode('Seçili todo güncellenemedi.');
    }
    break;

    #buraya case ile update-todo ekleyeceksin ve bu case düzenle butonuna basıldığında çalışacak ve düzenleme update işlemini yapacak.
  case 'update-todo':
    $id = $_POST['id'];
    $todo = $_POST['todo'];
    $done = (int)$_POST['done']; // done değerini integer olarak al

    // done değerini güncelleme sorgusu
    $query = $db->prepare('UPDATE todo SET todo = :todo, done = :done WHERE id = :id');
    $update = $query->execute(['id' => $id, 'todo' => $todo, 'done' => $done]);

    if ($update) {
      echo json_encode('Seçili todo güncellendi.');
    } else {
      echo json_encode('Seçili todo güncellenemedi.');
    }
    break;


  default:
    # code...
    break;
}
