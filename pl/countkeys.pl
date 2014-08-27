#!/usr/bin/perl

# Perl script for generating word frequencies from text files
# Kenneth Benoit, adapted from _Programming Perl_
# note: no punctuation counted at the moment
#       
# Notes:
# * all words coverted to lowercase
# * 

if ($ARGV[0] eq "-h" || ! $ARGV[0]) {
    die "Usage: wordcount infile(s) [>outfile]\n";
};

@filelist = @ARGV;

# first get a unique list of all words in all files
while(<>) {
  s/[^\w']/ /g;   # convert all non-words into spaces
  s/ +/ /g;       # convert all multiple spaces into single space
  tr/A-Z/a-z/;    # convert all words to lowercase
  s/^ //;         # ?

  foreach $word (split / /) {
    $frequency{$word}++;
  }
}

# sort them by frequency overall
@allwords = (sort {$frequency{$b} <=> $frequency{$a}} keys %frequency);

# get the total number of unique words across all files (m)
$allwords = @allwords;



# create the final storage array for words and counts
# format is word1 countfile1 countfile2 ... countfileN
#           word2 countfile1 countfile2 ... countfileN
# in a single dimensional array
#

# initialize the zero pad list
#
$filelistLength = @filelist;
for ($i=0; $i < $filelistLength; $i++) {
  $zeropad[$i] = 0;
}

# then create array with zero word counts
#
$j = 0;
for ($i=0; $i < $allwords; $i++) {
  $finalcount[$j] = $allwords[$i];
  for ($k=1; $k<=$filelistLength; $k++) {
    $finalcount[++$j] = 0;
  }
  $j++;
}




# --------------------------------
# process each file

$filecount = 1;
while ($filecount <= $filelistLength) {
  $filename = shift(@filelist);
  last if (!defined($filename));
  open (INFILE, $filename) ||
    die ("Cannot open input file $filename.\n");
  while($line = <INFILE>) {
    # convert all non-words into spaces
    $line =~ s/[^\w']/ /g;
    # convert all multiple spaces into single space
    $line =~ s/ +/ /g;
    $line =~ tr/A-Z/a-z/;    # convert all words to lowercase
    $line =~ s/^ //;         # ?

    foreach $word (split / /, $line) {
      $f1{$word}++;
    }
  }

  @f1[$allwords-1] = 0;
  while (($word, $count) = each(%f1)) {
    $i = 0;
    while ($word ne $allwords[$i]) {
      $i++;
    }
    $f1[$i] = $count;
  }
  # zero out assoc array which does the counting
  foreach $word (keys(%f1)) { $f1{$word} = 0; }

  # now assign freqs in @f1 to @finalcount
  for ($i=0; $i < $allwords; $i++) {
    #print "$allwords[$i] $f1[$i]\n";
    if (! $f1[$i]) {
      $f1[$i]=0;
    }
    $finalcount[$filecount + $i*($filelistLength+1)] = $f1[$i];
  }

$filecount++;
}


# print results
#
$j = 0;
for ($i=0; $i < $allwords; $i++) {
  print "$finalcount[$j]";
  for ($k=1; $k<=$filelistLength; $k++) {
    print "\t$finalcount[++$j]";
  }
  print "\n";
  $j++;
}




