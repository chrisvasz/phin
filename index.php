<?php
function outer() {
    inner();
    function inner() {
        echo "hello world";
    }
}
inner();
